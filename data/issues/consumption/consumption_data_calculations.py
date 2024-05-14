import pandas as pd
import json


PATH_CONSUMPTION_DATA = 'issues/consumption/consumption_data_raw.json'
OUTPUT_EXCEL_PATH = 'output/consumption_emissions.xlsx'


def get_consumption_emissions(df):

    # Parse JSON data
    with open(PATH_CONSUMPTION_DATA, 'r') as file:
        data = json.load(file)

    # List to store each municipality's emission properties
    features_list = []
    total_emissions_list = []

    for item in data:
        for feature in item['features']:
            # Get properties
            properties = feature['properties']

            # Rename keys
            properties['Kommun'] = properties.pop('kom_namn')

            total_emissions_list.append(
                {'Kommun': properties['Kommun'], 'Konsumtionsutsläpp (kg/person/år)': properties['Total emissions']})

            # Remove unwanted 'geoid' and 'län' key
            properties.pop('geoid', None)
            län = properties.pop('län', None)

            features_list.append(properties)

    # Convert to pandas DataFrame
    df_consumption = pd.DataFrame(features_list)

    df = df.merge(df_consumption, on='Kommun', how='left')
    return df
