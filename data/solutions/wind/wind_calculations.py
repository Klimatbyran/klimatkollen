import pandas as pd
import geopandas as gpd
from shapely.geometry import Point

# Path to Vindbruksollen data
PATH_VBK_DATA = 'solutions/wind/sources/VBK_export_allman_prod.xlsx'
# Path to Westander data
PATH_WESTANDER_DATA = 'solutions/wind/sources/westander_wind_data.xlsx'
# Path to municipality shapefile
PATH_MUNICIPALITY_SHAPEFILE = 'solutions/wind/sources/KommunSweref99TM/Kommun_Sweref99TM_region.shp'


def get_municipality_by_coordinates(source_municipality, north, east):
    # Load the shapefile
    gdf = gpd.read_file(PATH_MUNICIPALITY_SHAPEFILE)

    # Create a Point object from the SWEREF 99 coordinates
    point = Point(round(east), round(north))

    # Find the municipality that contains the point
    municipality_row = gdf[gdf.geometry.contains(point)]

    return municipality_row['KnNamn'].values[0] if not municipality_row.empty else source_municipality
    # if municipality_row.empty:
    #     return source_municipality
    # else:
    #     # Extract the name of the municipality
    #     municipality = municipality_row['KnNamn'].values[0]
    #     return municipality


def identify_projects_for_westander(df_multiple_municipalities, df_source):
    # Fill NaN with 0
    df_multiple_municipalities = df_multiple_municipalities.fillna(0)

    # Group VBK data by desired columns
    grouped_source_df = df_source.groupby(['Projekteringsområde', 'Status', 'Inlämningsdatum',
                                           'Överklagan inlämningsdatum', 'Laga kraft', 'Kommun'], dropna=False).agg({
                                               'N-Koordinat': lambda x: list(x),
                                               'E-Koordinat': lambda y: list(y)
                                           }).reset_index()

    # Combine the N-koordinat and E-koordinat lists into the desired format
    grouped_source_df['Coordinates'] = list(
        zip(grouped_source_df['N-Koordinat'], grouped_source_df['E-Koordinat']))
    grouped_source_df['Coordinates'] = grouped_source_df['Coordinates'].apply(
        lambda x: [[a, b] for a, b in zip(x[0], x[1])])

    # Drop the individual 'N-koordinat' and 'E-koordinat' columns
    grouped_source_df = grouped_source_df.drop(columns=['N-Koordinat', 'E-Koordinat'])

    for _, row in df_multiple_municipalities.iterrows():
        project_year = row['År slutligt beslut']
        total_turbines = row['Antal verk i ursprunglig ansökan']
        municipalities = row['Kommun'].split('/')

        # Extract turbines in source data for the current project name and create a copy
        turbines_in_source = grouped_source_df[grouped_source_df['Projekteringsområde'] == row['Projektnamn']].copy()

        # Extract the year and assign to the DataFrame
        year_series = turbines_in_source['Laga kraft'].combine_first(
            turbines_in_source['Överklagan inlämningsdatum'].combine_first(
                turbines_in_source['Inlämningsdatum']
            )
        ).dt.year
        turbines_in_source.loc[:, 'Year'] = year_series

        # Filter out rows that have the same year as 'År slutligt beslut'
        turbines_in_source = turbines_in_source[turbines_in_source['Year'] == project_year]

        # Count turbines in each of the two municipalities
        turbines_per_municipality = {municipality: 0 for municipality in municipalities}
        for _, turbine_row in turbines_in_source.iterrows():
            for coords in turbine_row['Coordinates']:
                north, east = coords
                municipality_name = get_municipality_by_coordinates(turbine_row['Kommun'], north, east)
                if municipality_name in municipalities:
                    turbines_per_municipality[municipality_name] += 1

        # Check if all turbines can be placed in one of the two municipalities
        if any(count == total_turbines for count in turbines_per_municipality.values()):
            df_multiple_municipalities.loc[df_multiple_municipalities['Projektnamn'] == row['Projektnamn'], 'Antal verk i ursprunglig ansökan'] = 0

    # Remove projects where 'Antal verk i ursprunglig ansökan' and 'Antal verk som ej fått tillstånd pga veto' are both 0
    df_multiple_municipalities = df_multiple_municipalities.loc[~((df_multiple_municipalities['Antal verk i ursprunglig ansökan'] == 0) & (df_multiple_municipalities['Antal verk som ej fått tillstånd pga veto'] == 0))]

    # Mapping from Projektnamn to Verksamhetsutövare
    project_operator_mapping = df_source.set_index('Projekteringsområde')['Verksamhetsutövare'].to_dict()

    # Add the 'Projektör' column based on the mapping
    df_multiple_municipalities['Projektör'] = df_multiple_municipalities['Projektnamn'].map(project_operator_mapping)


    return df_multiple_municipalities


def calculate_wind_data():
    # Read the data
    df_vbk = pd.read_excel(PATH_VBK_DATA, sheet_name="Vindkraftverk")
    df_westander = pd.read_excel(PATH_WESTANDER_DATA)

    # Filter out rows with "År slutligt beslut" 2014 or earlier
    df_westander = df_westander[df_westander['År slutligt beslut'] > 2014]

    # Filter out rows with "Kommun" containing '/', ie rows with two municipalities and filter relevant columns
    df_two_municipalities = df_westander[df_westander['Kommun'].str.contains('/')][['Kommun', 'Projektnamn', 'År slutligt beslut', 'Antal verk i ursprunglig ansökan',
                                                                                    'Antal verk som ej fått tillstånd pga veto']].reset_index(drop=True)

    df_projects_to_place = identify_projects_for_westander(df_two_municipalities, df_vbk)

    df_projects_to_place.to_excel('wind_results.xlsx', index=False)

    return 


calculate_wind_data()
