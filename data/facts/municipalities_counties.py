import pandas as pd

def get_municipalities():
    # Load the data
    df = pd.read_excel('facts/kommunlankod_2023.xls')

    # Set column names to 'Kod' and 'Namn'
    df.columns = ['Kod', 'Namn']

    # Drop unnecessary rows
    df = df.drop([0, 1, 2, 3, 4], axis=0).reset_index(drop=True)

    # Create an empty dataframe to store the result
    result = pd.DataFrame(columns=['Kommun', 'Kod', 'Län'])

    # Iterate through the rows of the dataframe
    for _, row in df.iterrows():
        if len(row['Kod']) == 4:  # Check if it is a four-digit code row
            code = row['Kod']
            municipality = row['Namn']
            # Lookup the county (Län) based on the two-digit code
            county = df.loc[df['Kod'] == code[:2], 'Namn'].values[0]
            # Append a new row to the 'result' DataFrame
            result = pd.concat([result, pd.DataFrame({'Kommun': [municipality], 'Kod': [code], 'Län': [county]})], ignore_index=True)

    # Return the resulting dataframe
    return result
