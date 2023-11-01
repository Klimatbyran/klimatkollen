import pandas as pd


def add_county(df):

    # Create an empty dataframe to store the result
    df_counties = pd.DataFrame(columns=['Kommun', 'Kod', 'Län'])

    # Iterate through the rows of the dataframe
    for i, row in df.iterrows():
        if len(row['Kod']) == 4:  # Check if it is a four-digit code row
            code = row['Kod']
            municipality = row['Namn']
            # Lookup the county (Län) based on the two-digit code
            county = df.loc[df['Kod'] == code[:2], 'Namn'].values[0]
            df_counties = df_counties.append(
                {'Kommun': municipality, 'Kod': code, 'Län': county}, ignore_index=True)

    return df_counties


def get_municipalities(path):
    # Load the data
    df = pd.read_excel(path)

    # Set column names to 'Kod' and 'Namn'
    df.columns = ['Kod', 'Namn']

    # Drop unnecessary rows
    df = df.drop([0, 1, 2, 3, 4], axis=0).reset_index(drop=True)

    # Add counties
    df_counties = add_county(df)

    # Return the resulting dataframe
    return df_counties
    