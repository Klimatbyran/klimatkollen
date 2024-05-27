import pandas as pd

PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/' + \
    'api/getexcelfile/?county=0&municipality=0&sub=CO2'


def get_smhi_data():
    # Download data from SMHI and load it in to a pandas dataframe
    df_raw = pd.read_excel(PATH_SMHI)

    # Remove the first 4 rows and reset the index
    df_raw = df_raw.drop([0, 1, 2]).reset_index(drop=True)

    # Put the first 4 elements in row 1 in to row 0
    df_raw.iloc[0, [0, 1, 2, 3]] = df_raw.iloc[1, [0, 1, 2, 3]]

    df_raw = df_raw.drop([1]).reset_index(
          drop=True)  # remove row 1 and reset the index

    # Change the column names to the first rows entries
    df_raw = df_raw.rename(columns=df_raw.iloc[0])
    df_raw = df_raw.drop([0])  # remove row 0
    return df_raw


def extract_sector_data(df):
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
    # Get the raw data from SMHI and minor cleaning
    df_raw = get_smhi_data()
    
    # Extract sector data from the SMHI data
    df_sectors = extract_sector_data(df_raw)

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

    df_merge = df_total.merge(df_sectors, on='Kommun', how='left')
    df = df.merge(df_merge, on='Kommun', how='left')

    return df
