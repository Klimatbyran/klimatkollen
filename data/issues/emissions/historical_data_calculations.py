import pandas as pd
import feather
import os
from datetime import datetime
import hashlib

PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/' + \
    'api/getexcelfile/?county=0&municipality=0&sub=CO2'


def cache_df(f: type(pd.read_excel)) -> type(pd.read_excel):
    """
    Cache the df to an intermediate file and use it if made this year

    Args:
        f: Function to cache

    Returns:
        f with caching of result
    """

    def caching_f(path=PATH_SMHI, *args, **kwargs):
        # Create a hash of the URL for the cache file
        url_hash = hashlib.md5(path.encode()).hexdigest()
        cache_file = f'cached_data_{url_hash}.feather'
        columns_file = f'cached_data_columns_{url_hash}.pkl'

        # Check if cached file and columns file exist and their timestamps
        if os.path.exists(cache_file):
            cache_mtime = datetime.fromtimestamp(os.path.getmtime(cache_file))
            current_year = datetime.now().year
            if cache_mtime.year == current_year:
                # Load cached data
                df = pd.read_feather(cache_file)
                # Load original column names
                if os.path.exists(columns_file):
                    original_columns = pd.read_pickle(columns_file)
                    df.columns = original_columns
                print(f"Loaded cached data from {cache_file}")
                return df

        # Process and cache the data
        df = f(path, *args, **kwargs)
        # Save the original column names separately
        original_columns = df.columns
        df.to_feather(cache_file)
        pd.to_pickle(original_columns, columns_file)

        print(f"Cached data to {cache_file}")
        return df

    caching_f.__name__ = f.__name__ + '_cached'
    return caching_f


@cache_df
def get_smhi_data(path=PATH_SMHI) -> pd.DataFrame:
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
