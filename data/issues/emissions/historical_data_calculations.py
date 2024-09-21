import hashlib
import os

import pandas as pd
import pyarrow.feather as feather

PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/' + \
    'api/getexcelfile/?county=0&municipality=0&sub=CO2'


def cache_df(f: callable = None, path: str = None, freq: str = '1Y'):
    """
    Cache the DataFrame to an intermediate file and use it if created within the same period.

    Args:
        f: A function to cache (e.g., a function that loads a DataFrame).
        path: Path to the file to be cached. If provided, it automatically supplies the path parameter to the decorated function.
        freq: Cache period, e.g. '1D', '1M', '1Y'. Defaults to '1Y'.

    Returns:
        A decorator that adds caching functionality to the intended function.

    Example usage:

    Create a test Excel file:
        >>> df_test = pd.DataFrame({"A": [1], "B": [2]})
        >>> test_path = "test_data.xlsx"
        >>> df_test.to_excel(test_path, index=False)

    Use the decorator to cache the DataFrame loaded from the file:
        >>> @cache_df
        ... def load_data(path):
        ...     print("Creating DataFrame from file (first call)...")
        ...     return pd.read_excel(path)
        >>> load_data.__name__
        'cache_df_load_data'
        >>> print(load_data(test_path))
        Creating DataFrame from file (first call)...
           A  B
        0  1  2

        >>> print(load_data(test_path))  # Data loaded from cache, no print output
           A  B
        0  1  2

    Use the decorator with a short expiration time:
        >>> @cache_df(path=test_path, freq='1ms')
        ... def load_data_short_expiry(path=test_path):
        ...     print("Creating DataFrame from file (short expiration)...")
        ...     return pd.read_excel(path)
        >>> print(load_data_short_expiry())
        Creating DataFrame from file (short expiration)...
           A  B
        0  1  2

        >>> import time
        >>> time.sleep(0.001)  # Sleep for 1 millisecond

        >>> print(load_data_short_expiry())  # Data expired, loading again from file
        Creating DataFrame from file (short expiration)...
           A  B
        0  1  2

    Clean up the test files:
        >>> file_hash = hashlib.md5(test_path.encode()).hexdigest()
        >>> os.remove(test_path)
        >>> os.remove(f"cache_df_load_data_{file_hash}.feather")
        >>> os.remove(f"cache_df_load_data_{file_hash}.pkl")
        >>> os.remove(f"cache_df_load_data_short_expiry_{file_hash}.feather")
        >>> os.remove(f"cache_df_load_data_short_expiry_{file_hash}.pkl")
    """
    if f is None:
        return lambda f: cache_df(f, path=path, freq=freq)

    def caching_f(*args, **kwargs):
        input_path = kwargs.get('path') or (args[0] if args else path)

        if not input_path:
            raise ValueError("Path parameter is required either as a decorator argument or function argument.")

        # Create a hash of the path for the cache file
        url_hash = hashlib.md5(input_path.encode()).hexdigest()
        cache_file = f'cache_df_{f.__name__}_{url_hash}.feather'
        columns_file = f'cache_df_{f.__name__}_{url_hash}.pkl'

        # Check if cached file and columns file exist and their timestamps
        if os.path.exists(cache_file):
            stat = os.stat(cache_file)
            cache_mtime = pd.Timestamp(stat.st_mtime_ns // 1_000_000, unit='ms')
            if pd.Period(pd.Timestamp.now(), freq=freq) == pd.Period(cache_mtime, freq=freq):
                # Load cached data
                df = pd.read_feather(cache_file)
                # Load original column names
                if os.path.exists(columns_file):
                    original_columns = pd.read_pickle(columns_file)
                    df.columns = original_columns
                return df

        # Process and cache the data
        df = f(*args, **kwargs)
        # Save the original column names separately
        original_columns = df.columns
        feather.write_feather(df, cache_file)
        pd.to_pickle(original_columns, columns_file)

        return df

    caching_f.__name__ = 'cache_df_' + f.__name__
    return caching_f


@cache_df(path=PATH_SMHI)
def get_smhi_data(path=PATH_SMHI):
    """
    Downloads data from SMHI and loads it into a pandas dataframe.

    Returns:
        pandas.DataFrame: The dataframe containing the SMHI data.
    """

    df_raw = pd.read_excel(path, engine="calamine")

    # Remove the first 4 rows and reset the index
    df_raw = df_raw.drop([0, 1, 2]).reset_index(drop=True)

    # Put the first 4 elements in row 1 in to row 0
    df_raw.iloc[0, [0, 1, 2, 3]] = df_raw.iloc[1, [0, 1, 2, 3]]

    df_raw = df_raw.drop([1]).reset_index(drop=True)  # remove row 1 and reset the index

    # Change the column names to the first rows entries
    df_raw = df_raw.rename(columns=df_raw.iloc[0])
    df_raw = df_raw.drop([0])  # remove row 0
    return df_raw


def extract_sector_data(df):
    """
    Extracts sector emissions.

    Args:
        df (pandas.DataFrame): The input DataFrame containing sector data.

    Returns:
        pandas.DataFrame: A DataFrame containing the extracted sector data.
    """

    df_sectors = pd.DataFrame()
    sectors = set(df['Huvudsektor'])
    sectors -= {'Alla'}
    first_sector = list(sectors)[0]

    for sector in sectors:
        df_sector = df[
            (df['Huvudsektor'] == sector)
            & (df['Undersektor'] == 'Alla')
            & (df['Län'] != 'Alla')
            & (df['Kommun'] != 'Alla')]
        df_sector.reset_index(drop=True)

        first_row = df_sector.iloc[0]
        df_sector_copy = df_sector.copy()

        # Iterate over the columns of the DataFrame within the current sector
        for col in df_sector_copy.columns[4:]:
            # Rename each column by concatenating the year with the 'Huvudsektor' value
            new_col_name = f"{col}_{first_row['Huvudsektor']}"
            df_sector_copy.rename(columns={col: new_col_name}, inplace=True)

        # Drop unnecessary columns
        df_sector_copy = df_sector_copy.drop(columns=['Huvudsektor', 'Undersektor', 'Län'])

        # Merge df_sector_copy with df_sectors
        if sector == first_sector:  # edge case for first sector
            df_sectors = df_sector_copy
        else:
            df_sectors = df_sectors.merge(df_sector_copy, on='Kommun', how='left')

    return df_sectors


def get_n_prep_data_from_smhi(df):
    """
    Retrieves and prepares municipality CO2 emission data from SMHI.

    Args:
        df (pandas.DataFrame): The input dataframe.

    Returns:
        pandas.DataFrame: The cleaned dataframe.
    """

    df_raw = get_smhi_data()

    # Uncomment below when sector emissions are to be introduced
    # Extract sector data from the SMHI data
    # df_sectors = extract_sector_data(df_raw)

    # Extract total emissions from the SMHI data
    df_total = df_raw[(df_raw['Huvudsektor'] == 'Alla')
                    & (df_raw['Undersektor'] == 'Alla')
                    & (df_raw['Län'] != 'Alla')
                    & (df_raw['Kommun'] != 'Alla')]
    df_total = df_total.reset_index(drop=True)

    # Remove said columns
    df_total = df_total.drop(columns=['Huvudsektor', 'Undersektor', 'Län'])
    df_total = df_total.sort_values(by=['Kommun'])  # sort by Kommun
    df_total = df_total.reset_index(drop=True)

    df = df.merge(df_total, on='Kommun', how='left')

    # Uncomment below when sector emissions are to be introduced
    # df_merge = df_total.merge(df_sectors, on='Kommun', how='left')

    return df


if __name__ == "__main__":
    import doctest

    doctest.testmod()