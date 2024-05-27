# -*- coding: utf-8 -*-

import json

from solutions.cars.electric_car_change_rate import get_electric_car_change_rate
from solutions.cars.electric_vehicle_per_charge_points import (
    get_electric_vehicle_per_charge_points,
)
from solutions.bicycles.bicycle_data_calculations import bicycle_calculations
from facts.plans.plans_data_prep import get_climate_plans
from facts.municipalities_counties import get_municipalities
from facts.procurements.climate_requirements_in_procurements import get_procurement_data
from issues.emissions.emission_data_calculations import emission_calculations
from issues.consumption.consumption_data_calculations import get_consumption_emissions
from test import validate_output

# Notebook from ClimateView that our calculations are based on:
# https://colab.research.google.com/drive/1qqMbdBTu5ulAPUe-0CRBmFuh8aNOiHEb?usp=sharing


# Get emission calculations
df = get_municipalities()
print('1. Municipalities loaded and prepped')

df = emission_calculations(df)
print('2. Climate data and calculations added')

df = get_electric_car_change_rate(df)
print('3. Hybrid car data and calculations added')

df = get_climate_plans(df)
print('4. Climate plans added')

df = bicycle_calculations(df)
print('5. Bicycle data added')

df = get_consumption_emissions(df)
print('6. Consumption emission data added')

df_evpc = get_electric_vehicle_per_charge_points()
df = df.merge(df_evpc, on='Kommun', how='left')
print('7. CPEV for December 2023 added')

df_procurements = get_procurement_data()
df = df.merge(df_procurements, on='Kommun', how='left')
print('8. Climate requirements in procurements added')

# Valid emission sectors in the SMHI sector data
# are extracted directly from Nationella emissionsdatabasen
# FIXME: a better solution in the future would be to extract them
# from the SMHI data directly, in for example emission/historical_data_calculations.py
sectors = [
    'Produktanvändning (inkl. lösningsmedel)',
    'Jordbruk',
    'Utrikes transporter',
    'Industri (energi + processer)',
    'Egen uppvärmning av bostäder och lokaler',
    'Arbetsmaskiner',
    'Transporter',
    'El och fjärrvärme', 'Avfall (inkl.avlopp)'
]

numeric_columns = [col for col in df.columns if str(col).isdigit()]

temp = []  # remane the columns
for i in range(len(df)):
    kommun = df.iloc[i]['Kommun']

    sectorEmissions = {}
    if kommun in df[f'1990_{sectors[0]}']:
        # The cement kommuner don't have this computed.
        for sector in sectors:
            sectorEmissions[sector] = {
                '1990': df[f'1990_{sector}'],
                '2000': df[f'2000_{sector}'],
                '2005': df[f'2005_{sector}'],
                '2010': df[f'2010_{sector}'],
                '2015': df[f'2015_{sector}'],
                '2016': df[f'2016_{sector}'],
                '2017': df[f'2017_{sector}'],
                '2018': df[f'2018_{sector}'],
                '2019': df[f'2019_{sector}'],
                '2020': df[f'2020_{sector}'],
                '2021': df[f'2021_{sector}'],
            }

    temp.append({
            'kommun': df.iloc[i]['Kommun'],
            'län': df.iloc[i]['Län'],
            'emissions': {
                '1990': df.iloc[i][1990],
                '2000': df.iloc[i][2000],
                '2005': df.iloc[i][2005],
                '2010': df.iloc[i][2010],
                '2015': df.iloc[i][2015],
                '2016': df.iloc[i][2016],
                '2017': df.iloc[i][2017],
                '2018': df.iloc[i][2018],
                '2019': df.iloc[i][2019],
                '2020': df.iloc[i][2020],
                '2021': df.iloc[i][2021],
            },
            'sectorEmissions': sectorEmissions,
            'budget': df.iloc[i]['Budget'],
            'emissionBudget': df.iloc[i]['parisPath'],
            'approximatedHistoricalEmission': df.iloc[i]['approximatedHistorical'],
            'totalApproximatedHistoricalEmission': df.iloc[i][
                'totalApproximatedHistorical'
            ],
            'trend': df.iloc[i]['trend'],
            'trendEmission': df.iloc[i]['trendEmission'],
            'historicalEmissionChangePercent': df.iloc[i][
                'historicalEmissionChangePercent'
            ],
            'neededEmissionChangePercent': df.iloc[i]['neededEmissionChangePercent'],
            'hitNetZero': df.iloc[i]['hitNetZero'],
            'budgetRunsOut': df.iloc[i]['budgetRunsOut'],
            'electricCarChangePercent': df.iloc[i]['electricCarChangePercent'],
            'electricCarChangeYearly': df.iloc[i]['electricCarChangeYearly'],
            'climatePlanLink': df.iloc[i]['Länk till aktuell klimatplan'],
            'climatePlanYear': df.iloc[i]['Antagen år'],
            'climatePlanComment': df.iloc[i]['Namn, giltighetsår, kommentar'],
            'bicycleMetrePerCapita': df.iloc[i]['metrePerCapita'],
            'totalConsumptionEmission': df.iloc[i]['Total emissions'],
            'electricVehiclePerChargePoints': df.iloc[i]['EVPC'],
            'procurementScore': df.iloc[i]['procurementScore'],
            'procurementLink': df.iloc[i]['procurementLink'],
        }
    )


with open('output/climate-data.json', 'w', encoding='utf8') as json_file:
    # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)

print('Climate data JSON file created and saved')

if validate_output():
    print('Tests on output file passed.')
else:
    print('WARNING: Tests on output file failed, see output above.')
