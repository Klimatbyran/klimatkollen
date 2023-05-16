# -*- coding: utf-8 -*-

import json
from facts.municiapalities_counties import export_to_xslx
from solutions.cars.car_data_calculations import car_calculations
from facts.plans.plans_data_prep import get_climate_plans
from facts.municiapalities_counties import get_municipalities
from issues.emissions.emission_data_calculations import emission_calculations

import numpy as np
import pandas as pd
import re


# Get emission calculations
df = get_municipalities()
print('Municipalities loaded and prepped')

df = emission_calculations(df)
print('Climate data and calculations all done')

df = car_calculations(df)
print('Hybrid car data and calculations finished')

df = get_climate_plans(df)
print('Climate plans added')


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
            '2020': df.iloc[i][2020]
        },
        'budget': df.iloc[i]['Budget'],
        'emissionBudget': df.iloc[i]['Paris Path'],
        'trend': df.iloc[i]['Linear Path'],
        'futureEmission': df.iloc[i]['Linear Emission'],
        'emissionChangePercent': df.iloc[i]['emissionChangePercent'],
        'hitNetZero': df.iloc[i]['hitNetZero'],
        'budgetRunsOut': df.iloc[i]['budgetRunsOut'],
        'electricCars': df.iloc[i]['electricCars'],
        'electricCarChangePercent': df.iloc[i]['electricCarChangePercent'],
        'electricCarChangeYearly': df.iloc[i]['electricCarChangeYearly'],
        'climatePlanLink': df.iloc[i]['Länk till aktuell klimatplan'],
        'climatePlanYear': df.iloc[i]['Antagen år'],
        'climatePlanComment': df.iloc[i]['Namn, giltighetsår, kommentar'],
    })

with open('climate-data.json', 'w', encoding='utf8') as json_file:  # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)

print('Cliamte data JSON file created and saved')

temp_df = pd.DataFrame(temp)
export_to_xslx(temp_df)

print('Cliamte data xlsx file created and saved')