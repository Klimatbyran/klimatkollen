# -*- coding: utf-8 -*-

import pandas as pd

lan2 = "Län"

def get_municipalities():
    # Load the data
    df = pd.read_excel('facts/kommunlankod_2023.xls')

    # Set column names to 'Kod' and 'Namn'
    df.columns = ['Kod', 'Namn']

    # Drop unnecessary rows
    df = df.drop([0, 1, 2, 3, 4], axis=0).reset_index(drop=True)

    # Create an empty dataframe to store the result
    lan = 'Län'
    print(lan)
    result = pd.DataFrame(columns=['Kommun', 'Kod', lan])   

    # Iterate through the rows of the dataframe
    for i, row in df.iterrows():
        if len(row['Kod']) == 4:  # Check if it is a four-digit code row
            code = row['Kod']
            municipality = row['Namn']
            # Lookup the county (Län) based on the two-digit code
            county = df.loc[df['Kod'] == code[:2], 'Namn'].values[0]
            result.loc[i] = [municipality, code, county]
            #result = result.append(
            #    {'Kommun': municipality, 'Kod': code, 'Län': county}, ignore_index=True)

    # Return the resulting dataframe
    return result