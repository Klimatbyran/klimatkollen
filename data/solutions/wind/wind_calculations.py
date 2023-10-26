import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# Path to Vindbruksollen data
PATH_VBK_DATA = 'sources/VBK_export_allman_prod.xlsx'
# Path to Westander data
PATH_WESTANDER_DATA = 'sources/westander_wind_data.xlsx'
# Path to municipality shapefile
PATH_MUNICIPALITY_SHAPEFILE = 'sources/KommunSweref99TM/Kommun_Sweref99TM_region.shp'


def get_municipality_by_coordinates(north, east):
    # Load the shapefile
    gdf = gpd.read_file(PATH_MUNICIPALITY_SHAPEFILE)

    # Create a Point object from the SWEREF 99 coordinates
    point = Point(east, north)

    # Find the municipality that contains the point
    municipality_row = gdf[gdf.geometry.contains(point)]

    if not municipality_row.empty:
        # Extract the name of the municipality
        municipality = municipality_row['KnNamn'].values[0]
        return municipality
    else:
        raise ValueError(
            "Coordinates do not fall within any known municipality")


def calculate_wind_data(df=None):
    # Read the data
    df_vbk = pd.read_excel(PATH_VBK_DATA, sheet_name="Vindkraftverk")
    df_westander = pd.read_excel(PATH_WESTANDER_DATA)

    # Filter out rows with "År slutligt beslut" 2014 or earlier
    df_westander = df_westander[df_westander['År slutligt beslut'] > 2014]

    # Filter out rows with "Kommun" containing '/', ie rows with two municipalities and filter relevant columns
    df_two_municipalities = df_westander[df_westander['Kommun'].str.contains('/')][['Kommun', 'Antal verk i ursprunglig ansökan',
                                                                                    'Antal verk som ej fått tillstånd pga veto']].reset_index(drop=True)

    # FIXME här ska de istället ta de rader som haft delade kommuner, matcha dem mot de rader i VBK som har samma projektnamn
    # sen ska den ha två pottar och beräkna koordinater för respektive vindkraftverk, och lägga den i rätt kommunpott
    rows = []
    for _, row in df_two_municipalities.iterrows():
        municipalities = row['Kommun'].split('/')
        for municipality in municipalities:
            rows.append({
                'Kommun': municipality.strip(),
                'Antal verk i ursprunglig ansökan': row['Antal verk i ursprunglig ansökan'] / len(municipalities),
                'Antal verk som ej fått tillstånd pga veto': row['Antal verk som ej fått tillstånd pga veto'] / len(municipalities)
            })

    df_split = pd.DataFrame(rows)

    # Remove rows with two municipalities from the original df
    df_westander = df_westander[~df_westander['Kommun'].str.contains(
        '/')].reset_index(drop=True)

    df_concat = pd.concat([df_westander, df_split], sort=True)
    df_merged_sum = df_concat.groupby('Kommun', sort=True).sum().reset_index()

    # Group by 'Kommun' and sum the numeric columns
    df_grouped = df_merged_sum.groupby('Kommun').sum().reset_index()

    # Calculate the column for veto denied wind power
    df_grouped['windPower'] = (df_grouped['Antal verk som ej fått tillstånd pga veto'] /
                               df_grouped['Antal verk i ursprunglig ansökan'])*100

    # Select only the relevant columns
    df_filtered = df_grouped[['Kommun', 'windPower']]

    # Uncomment below if new wind output excel is needed
    # # Write the new DataFrame to an xlsx file
    # df_filtered.to_excel('wind_output.xlsx', index=False)

    # Merge output_df with df
    # df_result = df.merge(df_filtered, on='Kommun', how='left')
    # # Fill NaN with the string 'NaN'
    # df_result['windPower'] = df_result['windPower'].fillna(-1)

    return df_filtered


get_municipality_by_coordinates(6707005, 567930)
