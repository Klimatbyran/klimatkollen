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
    point = Point(east, north)

    # Find the municipality that contains the point
    municipality_row = gdf[gdf.geometry.contains(point)]

    if municipality_row.empty:
        return source_municipality
    else:
        # Extract the name of the municipality
        municipality = municipality_row['KnNamn'].values[0]
        return municipality


def determine_turbine_count_for_municipality(municipality, df, project):
    # Check for empty dataframe or missing columns
    if df.empty or 'Projekteringsområde' not in df.columns:
        return 0

    # Determine how many wind turbines are situated in the given municipality
    rows_for_project = df[df['Projekteringsområde'] == project]
    count = 0

    for _, row in rows_for_project.iterrows():
        try:
            municipality_name = get_municipality_by_coordinates(
                row['N-Koordinat'], row['E-Koordinat'])
        except ValueError:
            municipality_name = None
        if municipality_name is None:
            municipality_name = row['Kommun']
        if municipality_name == municipality:
            count += 1

    return count


def calculate_split_municipalities(df_multiple_municipalities, df_source):
    # Fill NaN with 0
    df_multiple_municipalities = df_multiple_municipalities.fillna(0)

    # Group by desired columns
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
    grouped_source_df = grouped_source_df.drop(
        columns=['N-Koordinat', 'E-Koordinat'])

    grouped_source_df.to_excel('grouped_source.xlsx', index=False)

    results = []
    declared = 0
    placed = 0

    for _, row in df_multiple_municipalities.iterrows():
        project_year = row['År slutligt beslut']
        total_turbines = row['Antal verk i ursprunglig ansökan']

        # Extract turbines in source data for the current project name
        turbines_in_source = grouped_source_df[grouped_source_df['Projekteringsområde']
                                               == row['Projektnamn']]
        
        # Extract the year and assign to a new Series
        year_series = turbines_in_source['Laga kraft'].combine_first(
            turbines_in_source['Överklagan inlämningsdatum'].combine_first(
                turbines_in_source['Inlämningsdatum']
            )
        ).dt.year

        # Assign the new Series to the DataFrame using .loc
        turbines_in_source.loc[:, 'Year'] = year_series

        # Filter out rows that have the same year as 'År slutligt beslut'
        turbines_in_source = turbines_in_source[turbines_in_source['Year']
                                                == project_year]
        
        # Dictionary to store counts of turbines per municipality
        municipality_counts = {}

        for _, turbine_row in turbines_in_source.iterrows():
            for coords in turbine_row['Coordinates']:
                north, east = coords
                # Determine the municipality for the given coordinates
                municipality_name = get_municipality_by_coordinates(
                    turbine_row['Kommun'], north, east)

                # Update the count for the municipality
                municipality_counts[municipality_name] = municipality_counts.get(
                    municipality_name, 0) + 1

        # Calculate the total number of turbines placed
        total_turbines_placed = sum(municipality_counts.values())

        # Compare the total turbines from the row and the total turbines placed
        if total_turbines > total_turbines_placed:
            print(
                f"For project {row['Projektnamn']}, more turbines were declared ({total_turbines}) than placed ({total_turbines_placed}).")
        elif total_turbines < total_turbines_placed:
            print(
                f"For project {row['Projektnamn']}, fewer turbines were declared ({total_turbines}) than placed ({total_turbines_placed}).")
        else:
            print(
                f"For project {row['Projektnamn']}, amount placed and declared matched: {total_turbines}.")
        
        declared += total_turbines
        placed += total_turbines_placed

        # Add the computed counts for each municipality to the results list
        for municipality_name, count in municipality_counts.items():
            results.append({
                "Kommun": municipality_name,
                "Total": count
            })

        ''' det jag vill veta är
        1. är det lika många eller fler snurror i vbk som i westander
        2. om det är lika många eller fler
            a. börja gå igenom snurra för snurra i vbk och titta vilket år de har beslutsdatum. 
                för total: 
                    I. om det matchar westander, dra bort en snurra därifrån och lägg på rätt kommun
                    II. om det inte matchar westander, lägg en snurra om okänd på kombinerade kommunnamn
                för veto:
                    I. se om det finns icke beviljade snurror i vbk
                    II. är det lika många son i westander?
                        a. om ja, lägg till en snurra på rätt kommun
                        b. om nej, lägg till en snurra som okänd på båda kommunerna
        3. om det är färre
            a. börja gå igenom snurra för snurra i vbk och titta vilket år de har beslutsdatum. 
                för total: 
                    I. om det matchar westander, dra bort en snurra därifrån och lägg på rätt kommun
                    II. om det inte matchar westander, lägg en snurra om okänd på kombinerade kommunnamn
                för veto:
                    I. se om det finns icke beviljade snurror i vbk
                    II. är det lika många son i westander?
                        a. om ja, lägg till en snurra på rätt kommun
                        b. om nej, lägg till en snurra som okänd på båda kommunerna
            håll koll på hur många snurror som placerats ut, om det finns kvar på slutet läggs de till som okända på båda kommunerna
        '''

    # Convert the results to a DataFrame and append to the existing data or save to Excel

    print('declared', declared)
    print('placed', placed)
    results_df = pd.DataFrame(results)
    results_df.to_excel('results.xlsx', index=False)
    # if enough_turbines:
    #     for _, turbine in turbines_in_source.iterrows():
    #         total_turbines_to_assign = total_turbines
    #         vetoed_turbines_to_assign = vetoed_turbines

    #         turbine_year = turbine['Överklagan inlämningsdatum'] if turbine['Överklagan inlämningsdatum'] else (
    #             turbine['Inlämningsdatum'] if turbine['Inlämningsdatum'] else None)

    #         if turbine_year == project_year:
    #             while total_turbines_to_assign > 0:
    #                 for municipality in municipalities:
    #                     # Check if there's already a row with the given Kommun and Year
    #                     existing_row = next(
    #                         (row for row in rows if row['Kommun'] == municipality and row['Year'] == project_year), None)

    #                     if existing_row:
    #                         # If the row exists, increment the 'Antal verk i ursprunglig ansökan' count
    #                         existing_row['Antal verk i ursprunglig ansökan'] += 1
    #                     else:
    #                         # If not, append a new row
    #                         rows.append({
    #                             'Kommun': municipality,
    #                             'Year': project_year,
    #                             'Antal verk i ursprunglig ansökan': 1,
    #                         })

    #                     total_turbines_to_assign -= 1

    # vetoed_turbines = row['Antal verk som ej fått tillstånd pga veto']

    # # total number of turbines are same as in source data
    # if turbine_count_source >= total_turbines:
    #     for municipality in municipalities:
    #         rows.append({
    #             'Kommun': municipality.strip(),
    #             'Antal verk i ursprunglig ansökan':  determine_turbine_count_for_municipality(
    #                 municipality, df_source, row['Projektnamn']),
    #             'Antal verk som ej fått tillstånd pga veto': 0 if vetoed_turbines == 0 else '?'
    #         })
    # else:
    #     for municipality in municipalities:
    #         rows.append({
    #             'Kommun': municipality.strip(),
    #             'Antal verk i ursprunglig ansökan':  determine_turbine_count_for_municipality(
    #                 municipality, df_source, row['Projektnamn']),
    #             'Antal verk som ej fått tillstånd pga veto': 0
    #         })

    # df_split = pd.DataFrame(rows)
    # return df_split


def calculate_wind_data(df=None):
    # Read the data
    df_vbk = pd.read_excel(PATH_VBK_DATA, sheet_name="Vindkraftverk")
    df_westander = pd.read_excel(PATH_WESTANDER_DATA)

    # Filter out rows with "År slutligt beslut" 2014 or earlier
    df_westander = df_westander[df_westander['År slutligt beslut'] > 2014]
    print('totalt antal totala verk: ', df_westander['Antal verk i ursprunglig ansökan'].sum())

    # Filter out rows with "Kommun" containing '/', ie rows with two municipalities and filter relevant columns
    df_two_municipalities = df_westander[df_westander['Kommun'].str.contains('/')][['Kommun', 'Projektnamn', 'Antal verk i ursprunglig ansökan', 'År slutligt beslut',
                                                                                    'Antal verk som ej fått tillstånd pga veto']].reset_index(drop=True)

    df_split = calculate_split_municipalities(df_two_municipalities, df_vbk)

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

    # # Merge output_df with df
    # df_result = df.merge(df_filtered, on='Kommun', how='left')
    # # Fill NaN with the string 'NaN'
    # df_result['windPower'] = df_result['windPower'].fillna(-1)

    return df_filtered


calculate_wind_data()
