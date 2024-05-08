# -*- coding: utf-8 -*-

import json
from typing import Dict, List, Any

import pandas as pd

from solutions.cars.electric_car_change_rate import get_electric_car_change_rate
from solutions.cars.electric_vehicle_per_charge_points import get_electric_vehicle_per_charge_points
from solutions.bicycles.bicycle_data_calculations import bicycle_calculations
from facts.plans.plans_data_prep import get_climate_plans
from facts.municipalities_counties import get_municipalities
from facts.procurements.climate_requirements_in_procurements import get_procurement_data
from issues.emissions.emission_data_calculations import emission_calculations
from issues.consumption.consumption_data_calculations import get_consumption_emissions

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

def round_processing(v, num_decimals):
    new_v = v
    if (isinstance(v, dict)):
        new_v = {k: round_processing(a, num_decimals) for k, a in v.items()}
    elif (isinstance(v, float)):
        new_v = round(v, num_decimals)
    return new_v
    
def create_dataentry(row: pd.Series, num_decimals: int) -> Dict[str, Any]:    
    entry = {
            'kommun': row['Kommun'],
            'län': row['Län'],
            'emissions': {
                '1990': row[1990],
                '2000': row[2000],
                '2005': row[2005],
                '2010': row[2010],
                '2015': row[2015],
                '2016': row[2016],
                '2017': row[2017],
                '2018': row[2018],
                '2019': row[2019],
                '2020': row[2020],
                '2021': row[2021],
            },
            'budget': row['Budget'],
            'emissionBudget': row['parisPath'],
            'approximatedHistoricalEmission': row['approximatedHistorical'],
            'totalApproximatedHistoricalEmission': row['totalApproximatedHistorical'],
            'trend': row['trend'],
            'trendEmission': row['trendEmission'],
            'historicalEmissionChangePercent': row[
                'historicalEmissionChangePercent'
            ],
            'neededEmissionChangePercent': row[
                'neededEmissionChangePercent'
            ],
            'hitNetZero': row['hitNetZero'],
            'budgetRunsOut': row['budgetRunsOut'],
            'electricCarChangePercent': row['electricCarChangePercent'],
            'electricCarChangeYearly': row['electricCarChangeYearly'],
            'climatePlanLink': row['Länk till aktuell klimatplan'],
            'climatePlanYear': row['Antagen år'],
            'climatePlanComment': row['Namn, giltighetsår, kommentar'],
            'bicycleMetrePerCapita': row['metrePerCapita'],
            'totalConsumptionEmission': row['Total emissions'],
            'electricVehiclePerChargePoints': row['EVPC'],
            'procurementScore': row['procurementScore'],
            'procurementLink': row['procurementLink'],
        }
    
    # https://stackoverflow.com/a/62752901

    if (num_decimals > 0):
        entry = {k: round_processing(v, num_decimals) for k, v in entry.items()}

    return entry
    
def create_datastructure_from_df(df: pd.DataFrame, num_decimals: int = -1) -> List[Dict[str, Any]]:
    '''
    Create a datastructure from a dataframe.
    Optionally round the values to a certain number of decimals.
    '''

    temp = [
        create_dataentry(df.iloc[i], num_decimals)
        for i in range(len(df))
    ]
    return temp

with open('output/climate-data.json', 'w', encoding='utf8') as json_file:
    # save dataframe as json file
    json.dump(create_datastructure_from_df(df), json_file, ensure_ascii=False, default=str)

print('Climate data JSON file created and saved')

with open('output/climate-data-rounded.json', 'w', encoding='utf8') as json_rounded_file:
    # save dataframe as json file
    json.dump(create_datastructure_from_df(df, num_decimals=3), json_rounded_file, ensure_ascii=False, default=str)

print('Climate data JSON file with rounded values created and saved')
