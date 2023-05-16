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
    for i, row in df.iterrows():
        if len(row['Kod']) == 4:  # Check if it is a four-digit code row
            kod = row['Kod']
            kommun = row['Namn']
            # Lookup the county (Län) based on the two-digit code
            län = df.loc[df['Kod'] == kod[:2], 'Namn'].values[0]
            result = result.append(
                {'Kommun': kommun, 'Kod': kod, 'Län': län}, ignore_index=True)

    # Return the resulting dataframe
    return result


def export_to_xslx(df):
    df.rename(columns={'kommun': 'Kommun'}, inplace=True)
    df.rename(columns={'län': 'Län'}, inplace=True)
    df.rename(columns={
        'electricCarChangePercent': 'KPI1: Förändringstakt andel laddbara bilar'}, inplace=True)
    df.rename(
        columns={'climatePlanLink': 'KPI2: Klimatplan länk'}, inplace=True)
    df.rename(
        columns={'climatePlanYear': 'KPI2: Klimatplan antagen år'}, inplace=True)

    filtered_df = df[['Kommun',
                      'Län',
                      'KPI1: Förändringstakt andel laddbara bilar',
                      'KPI2: Klimatplan länk',
                      'KPI2: Klimatplan antagen år']]

    # Create an ExcelWriter object
    writer = pd.ExcelWriter('climate-data.xlsx', engine='xlsxwriter')

    # Group the data by 'Län' and save each group on a separate tab
    for län, group in filtered_df.groupby('Län'):
        group.to_excel(writer, sheet_name=län, index=False)

    # Save the Excel file
    writer.save()

    print('Cliamte data xlsx file created and saved')
