# -*- coding: utf-8 -*-

import json
import pandas as pd

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
    'Egen uppärmning av bostäder och lokaler',
    'Arbetsmaskiner',
    'Transporter',
    'El och fjärrvärme',
    'Avfall (inkl.avlopp)'
]

numeric_columns = [col for col in df.columns if str(col).isdigit()]

temp = []  # remane the columns
for i in range(len(df)):
    kommun = df.iloc[i]['Kommun']

    sectorEmissions = {}
    # The cement kommuner don't have this computed so we need to check if the sector exists
    if not pd.isnull(df.iloc[i][f'{numeric_columns[0]}_{sectors[0]}']):        
        for sector in sectors:
            sectorEmissions[sector] = {}
            for year_col in numeric_columns:
                year = str(year_col)
                sectorEmissions[sector][year] = df[f'{year}_{sector}']

    temp.append({
            'kommun': df.iloc[i]['Kommun'],
            'län': df.iloc[i]['Län'],
            'emissions': { str(year): df.iloc[i][year] for year in numeric_columns },
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
