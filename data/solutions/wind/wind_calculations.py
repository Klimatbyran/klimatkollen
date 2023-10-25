import pandas as pd

PATH_WIND_DATA = 'solutions/wind/wind_data.xlsx'


def calculate_wind_data(df):
    # Read the data
    df_wind = pd.read_excel(PATH_WIND_DATA)

    # Filter out rows with "År slutligt beslut" 2014 or earlier
    df_wind = df_wind[df_wind['År slutligt beslut'] > 2014]

    # Filter out rows with "Kommun" containing '/', ie rows with two municipalities and filter relevant columns
    df_two_municipalities = df_wind[df_wind['Kommun'].str.contains('/')][['Kommun', 'Antal verk i ursprunglig ansökan',
                                                                          'Antal verk som ej fått tillstånd pga veto']].reset_index(drop=True)

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
    df_wind = df_wind[~df_wind['Kommun'].str.contains(
        '/')].reset_index(drop=True)

    df_concat = pd.concat([df_wind, df_split], sort=True)
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
    df_result = df.merge(df_filtered, on='Kommun', how='left')
    # Fill NaN with the string 'NaN'
    df_result['windPower'] = df_result['windPower'].fillna(-1)

    return df_result
