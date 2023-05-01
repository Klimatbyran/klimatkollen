# -*- coding: utf-8 -*-

import json
from data.cars.car_data_calculations import car_calculations
from data.emissions.emission_data_calculations import emission_calculations
import numpy as np
import pandas as pd
import re

PATH_PLANS_DATA = 'klimatplaner.xlsx'

MUNICIPALITIES_W_S = ['Alingsås kommun', 'Bengtsfors kommun', 'Bollnäs kommun', 'Borås stad', 'Degerfors kommun', 'Grums kommun',
                      'Hagfors kommun', 'Hofors kommun', 'Hällefors kommun', 'Höganäs kommun', 'Kramfors kommun', 'Munkfors kommun',
                      'Mönsterås kommun', 'Robertsfors kommun', 'Sotenäs kommun', 'Storfors kommun', 'Strängnäs kommun', 'Torsås kommun',
                      'Tranås kommun', 'Vännäs kommun', 'Västerås stad']


def clean_kommun(kommun):
    # Remove any whitespace
    kommun = kommun.strip()

    # Replace 'Falu kommun' with 'Falun'
    if kommun == 'Falu kommun':
        return 'Falun'

    if kommun == 'Region Gotland (kommun)':
        print(kommun)
        return 'Gotland'

    # Remove 'kommun' or 'stad' from municipalities in the list 'municipalities_w_s'
    if kommun in MUNICIPALITIES_W_S:
        kommun = re.sub(r'( kommun| stad)', '', kommun)

    # Remove 'kommun', 'stad', 's kommun', or 's stad' from all other municipalities
    kommun = re.sub(r'( kommun| stad|s kommun|s stad)', '', kommun)

    return kommun


def get_climate_plans(df):
    # LOAD CLIMATE PLANS

    df_plans = pd.read_excel(PATH_PLANS_DATA)

    # name columns after row 1
    df_plans.columns = df_plans.iloc[0]
    df_plans = df_plans.drop(0)  # drop usless rows
    df_plans = df_plans.reset_index(drop=True)

    df_plans['Kommun'] = df_plans['Kommun'].apply(clean_kommun)

    df_plans = df_plans.rename(
        columns={df_plans.columns[6]: 'cred'})

    df_plans = df_plans.where(pd.notnull(df_plans), 'Saknas')

    df = df.merge(df_plans, on='Kommun', how='left')

    return df


# Get emission calculations
df = emission_calculations()
df = car_calculations(df)
df = get_climate_plans(df)


# MERGE ALL DATA IN LIST TO RULE THEM ALL

temp = []  # remane the columns
for i in range(len(df_cem)):
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
        'climatePlanContact': df.iloc[i]['Kontakt'],
        'climatePlanLink': df.iloc[i]['Länk till aktuell klimatplan'],
        'climatePlanYear': df.iloc[i]['Antagen år'],
        'climatePlanCred': df.iloc[i]['cred'],
    })

with open('climate-data.json', 'w', encoding='utf8') as json_file:  # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)
