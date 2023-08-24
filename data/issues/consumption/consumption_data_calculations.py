import pandas as pd
import json


PATH_CONSUMPTION_DATA = 'issues/consumption/consumption_data_raw.json'

def get_consumption_emissions(df):

    # Parse JSON data
    with open(PATH_CONSUMPTION_DATA, 'r') as file:
        data = json.load(file)

    # List to store each municipality's emission properties
    features_list = []

    for item in data:
        for feature in item['features']:
            # Get properties
            properties = feature['properties']

            # Remove unwanted 'geoid' key
            properties.pop('geoid', None)
            properties.pop('län', None)

            # Rename keys
            properties['Kommun'] = properties.pop('kom_namn')

            features_list.append(properties)

    # Convert to pandas DataFrame
    df_consumption = pd.DataFrame(features_list)

    df = df.merge(df_consumption, on='Kommun', how='left')
    return df
