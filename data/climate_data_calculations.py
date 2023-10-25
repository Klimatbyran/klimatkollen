# -*- coding: utf-8 -*-

import json
import numpy as np
import pandas as pd

from solutions.cars.car_data_calculations import car_calculations
from solutions.bicycles.bicycle_data_calculations import bicycle_calculations
from solutions.wind.wind_calculations import calculate_wind_data
from facts.plans.plans_data_prep import get_climate_plans
from facts.municipalities_counties import get_municipalities
from issues.emissions.emission_data_calculations import emission_calculations
from issues.consumption.consumption_data_calculations import get_consumption_emissions
from export_data import export_to_xlsx

# Notebook from ClimateView that our calculations are based on:
# https://colab.research.google.com/drive/1qqMbdBTu5ulAPUe-0CRBmFuh8aNOiHEb?usp=sharing


# Get emission calculations
df = get_municipalities()
print('Municipalities loaded and prepped')

df = emission_calculations(df)
print('Climate data and calculations all done')

df = car_calculations(df)
print('Hybrid car data and calculations finished')

df = get_climate_plans(df)
print('Add climate plans')

df = bicycle_calculations(df)
print('Add bicycle data')

df = get_consumption_emissions(df)
print('Add consumption emission data')

df = calculate_wind_data(df)
print('Add wind data')

# MERGE ALL DATA IN LIST TO RULE THEM ALL

temp = []  # remane the columns
for i in range(len(df)):
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
            '2021': df.iloc[i][2021]
        },
        'budget': df.iloc[i]['Budget'],
        'emissionBudget': df.iloc[i]['parisPath'],
        'trend': df.iloc[i]['trend'],
        'futureEmission': df.iloc[i]['trendEmission'],
        'emissionChangePercent': df.iloc[i]['emissionChangePercent'],
        'hitNetZero': df.iloc[i]['hitNetZero'],
        'budgetRunsOut': df.iloc[i]['budgetRunsOut'],
        'electricCars': df.iloc[i]['electricCars'],
        'electricCarChangePercent': df.iloc[i]['electricCarChangePercent'],
        'electricCarChangeYearly': df.iloc[i]['electricCarChangeYearly'],
        'climatePlanLink': df.iloc[i]['Länk till aktuell klimatplan'],
        'climatePlanYear': df.iloc[i]['Antagen år'],
        'climatePlanComment': df.iloc[i]['Namn, giltighetsår, kommentar'],
        'bicycleMetrePerCapita': df.iloc[i]['metrePerCapita'],
        'totalConsumptionEmission': df.iloc[i]['Total emissions'],
        'windPower': df.iloc[i]['windPower'],
    })

with open('output/climate-data.json', 'w', encoding='utf8') as json_file:  # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)

print('Climate data JSON file created and saved')

temp_df = pd.DataFrame(temp)
export_to_xlsx(temp_df)
