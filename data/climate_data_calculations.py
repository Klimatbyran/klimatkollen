# -*- coding: utf-8 -*-

import json
from cars.car_data_calculations import car_calculations
from plans.plans_data_prep import get_climate_plans
from emissions.emission_data_calculations import emission_calculations
import numpy as np
import pandas as pd
import re

# Get emission calculations
df = emission_calculations()
df = car_calculations(df)
df = get_climate_plans(df)


# MERGE ALL DATA IN LIST TO RULE THEM ALL

temp = []  # remane the columns
for i in range(len(df)):
    temp.append({
        'kommun': df.iloc[i]['Kommun'],
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