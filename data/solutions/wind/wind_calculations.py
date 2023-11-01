import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# Path to Vindbruksollen data
PATH_VBK_DATA = 'solutions/wind/sources/VBK_export_allman_prod.xlsx'
# Path to Westander data
PATH_WESTANDER_DATA = 'solutions/wind/sources/westander_wind_data.xlsx'
# Path to municipality shapefile
PATH_MUNICIPALITY_SHAPEFILE = 'solutions/wind/sources/KommunSweref99TM/Kommun_Sweref99TM_region.shp'


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

def determine_turbine_count_for_municipality(municipality, df_vbk, project):
    # Determine how many wind turbines are situated in the given municipality
    rows_for_project = df_vbk[df_vbk['Projekteringsområde'] == project]
    count = 0

    for _, row in rows_for_project.iterrows():
        try:
            municipality_name = get_municipality_by_coordinates(row['N-Koordinat'], row['E-Koordinat'])
        except ValueError:
            municipality_name = None
        if municipality_name is None:
            municipality_name = row['Kommun']
        if municipality_name == municipality:
            count += 1

    return count

def calculate_wind_data(df=None):
    # Read the data
    df_vbk = pd.read_excel(PATH_VBK_DATA, sheet_name="Vindkraftverk")
    df_westander = pd.read_excel(PATH_WESTANDER_DATA)

    # Filter out rows with "År slutligt beslut" 2014 or earlier
    df_westander = df_westander[df_westander['År slutligt beslut'] > 2014]

    # Filter out rows with "Kommun" containing '/', ie rows with two municipalities and filter relevant columns
    df_two_municipalities = df_westander[df_westander['Kommun'].str.contains('/')][['Kommun', 'Projektnamn', 'Antal verk i ursprunglig ansökan',
                                                                                    'Antal verk som ej fått tillstånd pga veto']].reset_index(drop=True)

    rows = []
    for _, row in df_two_municipalities.iterrows():
        municipalities = row['Kommun'].split('/')
        for municipality in municipalities:
            verk_count = determine_turbine_count_for_municipality(municipality, df_vbk, row['Projektnamn'])
            rows.append({
                'Kommun': municipality.strip(),
                'Antal verk i ursprunglig ansökan': verk_count,
                'Antal verk som ej fått tillstånd pga veto': verk_count # This assumes vetoed verk count is same as total verk, adjust if needed.
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


print(calculate_wind_data().head(20))
