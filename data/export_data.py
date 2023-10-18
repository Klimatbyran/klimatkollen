import pandas as pd


def export_to_county_xlsx(df):
    df['KPI1: Förändringstakt andel laddbara bilar (%)'] = df['electricCarChangePercent'].apply(
        lambda x: round(x*100, 1))

    df.rename(columns={'kommun': 'Kommun'}, inplace=True)
    df.rename(columns={'län': 'Län'}, inplace=True)
    df.rename(
        columns={'climatePlanLink': 'KPI2: Klimatplan länk'}, inplace=True)
    df.rename(
        columns={'climatePlanYear': 'KPI2: Klimatplan antagen år'}, inplace=True)

    emissions_keys = df['emissions'].iloc[0].keys()
    last_year = int(list(emissions_keys)[-1])
    second_last_year = int(list(emissions_keys)[-2])

    emission_diff_label = f'Utsläppsförändring {second_last_year}-{last_year} (%)'
    df[emission_diff_label] = df['emissions'].apply(lambda x: round(
        ((x[str(last_year)]-x[str(second_last_year)])/x[str(second_last_year)])*100, 1))

    emission_diff_abs_label = f'Utsläppsförändring {second_last_year}-{last_year} (kton)'
    df[emission_diff_abs_label] = df['emissions'].apply(
        lambda x: round((x[str(last_year)]-x[str(second_last_year)])/1000, 1))

    consumption_label = f'Konsumtionsutsläpp (kg/person/år)'
    df.rename(
        columns={'totalConsumptionEmission': consumption_label}, inplace=True)


    filtered_df = df[['Kommun',
                      'Län',
                      emission_diff_label,
                      emission_diff_abs_label,
                      'KPI1: Förändringstakt andel laddbara bilar (%)',
                      'KPI2: Klimatplan länk',
                      'KPI2: Klimatplan antagen år',
                      consumption_label,]]

    # Create an ExcelWriter object
    writer = pd.ExcelWriter(
        'output/county-climate-data.xlsx', engine='xlsxwriter')
    print('Created Excel with municipality emission and KPI:s')

    # Group the data by 'Län' and save each group on a separate tab
    for län, group in filtered_df.groupby('Län'):
        group.to_excel(writer, sheet_name=län, index=False)

    # Save the Excel file
    writer.save()

    print('Climate data xlsx file created and saved')
