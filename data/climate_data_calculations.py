# -*- coding: utf-8 -*-

import datetime
import json
import numpy as np
import pandas as pd
import re


# Budget i ton från och med 2020
BUDGET = 170000000  # +40948459*50.81/46.29+40948459*50.81/46.29*1.05

# LOAD AND PREPARE DATA FROM SMHI

# Download data from SMHI and load it in to a pandas dataframe
path_smhi = 'https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2'
df_raw = pd.read_excel(path_smhi)
df = df_raw  # so that I dont have to re-download the data

df = df.drop([0, 1, 2])  # remove the first 4 rows
df = df.reset_index(drop=True)  # reset index

# Put the first 4 elements in row 1 in to row 0
df.iloc[0, [0, 1, 2, 3]] = df.iloc[1, [0, 1, 2, 3]]

df = df.drop([1])  # remove row 1
df = df.reset_index(drop=True)  # reset index
# change the coloum names to the first rows entries
df = df.rename(columns=df.iloc[0])
df = df.drop([0])  # remove row 0

df = df[(df['Huvudsektor'] == 'Alla') & (df['Undersektor'] == 'Alla')
        & (df['Län'] != 'Alla') & (df['Kommun'] != 'Alla')]
df = df.reset_index(drop=True)

# Remove said columns
df = df.drop(columns=['Huvudsektor', 'Undersektor', 'Län'])
df = df.sort_values(by=['Kommun'])  # sort by Kommun
df = df.reset_index(drop=True)

# https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=1441 Sources for cement deduction
# https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=5932
# https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=834

cement_deduction = {'Mörbylånga':
                    {2010: 248025000/1000, 2015: 255970000/1000, 2016: 239538000/1000,
                        2017: 255783000/1000, 2018: 241897000/1000, 2019: 65176000/1000, 2020: 0},
                    'Skövde':
                    {2010: 356965000/1000, 2015: 358634000/1000, 2016: 384926000/1000, 2017: 407633130 /
                        1000, 2018: 445630340/1000, 2019: 440504330/1000, 2020: 459092473/1000},
                    'Gotland':
                    {2010: 1579811000/1000, 2015: 1926036000/1000, 2016: 1903887000/1000, 2017: 1757110000 /
                     1000, 2018: 1740412000/1000, 2019: 1536480000/1000, 2020: 1624463000/1000}
                    }

df_cem = df.copy()  # copy dataframe

# Deduct cement from given kommuns
for i in cement_deduction.keys():
    for j in cement_deduction[i].keys():
        df_cem.loc[df_cem['Kommun'] == i, j] = df_cem.loc[df_cem['Kommun']
                                                          == i, j].values - cement_deduction[i][j]

# Calculate each kommuns procentage of the total budget using grandfathering
year_range = [2015, 2016, 2017, 2018, 2019]
df_cem['Andel'] = [df_cem[year_range].sum(axis=1)[i]/df_cem[year_range].sum(
    axis=0).sum() for i in range(len(df_cem))]

# Update each kommuns budget given the new 2020 data
df_cem['Budget'] = BUDGET*df_cem['Andel']-df_cem[2020]

# Create an exponential curve that satisfy each kommuns budget
temp = []
for i in range(len(df_cem)):
    dicts = {}
    keys = range(2020, 2050+1)
    for idx, value in enumerate(keys):
        dicts[value] = df_cem.iloc[i][2020] * \
            np.exp(-(df_cem.iloc[i][2020])/(df_cem.iloc[i]['Budget'])*idx)
    temp.append(dicts)

df_cem['Paris Path'] = temp  # add the exponential path to the dataframe

# Calculate the linerar trend
temp = []
for i in range(len(df_cem)):
    dicts = {2020: df_cem.iloc[i][2020]}
    x = np.arange(2015, 2020+1)
    y = np.array(df_cem.iloc[i][5:10+1], dtype=float)
    fit = np.polyfit(x, y, 1)

    keys = range(2021, 2050+1)
    for idx, value in enumerate(keys):
        dicts[value] = max(0, fit[0]*value+fit[1])
    temp.append(dicts)

df_cem['Linear Path'] = temp  # add the linear trend to the dataframe

# Calculate the emission from the linear trend using the trapezoidal rule
temp = []
for i in range(len(df_cem)):
    temp.append(np.trapz(list(df_cem.iloc[i]['Linear Path'].values()), list(
        df_cem.iloc[i]['Linear Path'].keys())))

# Add the emission form the linear trend to the dataframe
df_cem['Linear Emission'] = temp


# LOAD CRUNCHED DATA FROM CLIMATE VIEW
# fix while rest of calculations are missing

path_crunched_data = 'output_extra.xlsx'
df_raw_crunched = pd.read_excel(path_crunched_data)

df_raw_crunched['emissionChangePercent'] = df_raw_crunched['Procent minskning varje år med exponentiellt avtagande bana']
df_raw_crunched['hitNetZero'] = [i.date() if type(
    i) is datetime.datetime else i for i in df_raw_crunched['När netto noll nås']]
df_raw_crunched['budgetRunsOut'] = [i.date() if type(
    i) is datetime.datetime else i for i in df_raw_crunched['Budget tar slut']]

df_crunched = df_raw_crunched.filter(
    ['Kommun', 'emissionChangePercent', 'hitNetZero', 'budgetRunsOut'], axis=1)

df_master = df_cem.merge(df_crunched, on='Kommun', how='left')


# LOAD AND PREP DATA FROM TRAFA ON SHARE OF ELECTIC OR HYBRID CARS IN SALES

path_trafa_data = 'kpi1_trafa.xlsx'  # data on sold cars by trafa
df_raw_trafa = pd.read_excel(path_trafa_data, sheet_name='Tabell 5 Personbil')

df_raw_trafa.columns = df_raw_trafa.iloc[3]  # name columns after row 4
df_raw_trafa = df_raw_trafa.drop([0, 1, 2, 3, 4, 5])  # drop usless rows
df_raw_trafa = df_raw_trafa.reset_index(drop=True)

# Clean data in columns
df_raw_trafa['Kommun'] = df_raw_trafa['Municipality'].str.strip()
df_raw_trafa = df_raw_trafa.drop(
    df_raw_trafa[df_raw_trafa['Kommun'] == 'Okänd Kommun   '].index)
df_raw_trafa = df_raw_trafa.dropna(subset=['Kommun'])
df_raw_trafa['electricity'] = df_raw_trafa['Electricity'].replace(' –', 0)
df_raw_trafa['plugIn'] = df_raw_trafa['Plug-in '].replace(' –', 0)

df_raw_trafa['electricCars'] = (
    (df_raw_trafa['electricity'] + df_raw_trafa['plugIn'])/df_raw_trafa['Total'])

df_trafa = df_raw_trafa.filter(['Kommun', 'electricCars'], axis=1)
# special solution for Upplands-Väsby which is named differently in the two dataframes
df_trafa.loc[df_trafa['Kommun'] ==
             'Upplands-Väsby', 'Kommun'] = 'Upplands Väsby'

df_master = df_master.merge(df_trafa, on='Kommun', how='left')


# LOAD AND PREP DATA ON CHANGE RATE OF PERCENTAGE OF NEWLY REGISTERED RECHARGABLE CARS PER MUNICIPALITY AND YEAR

path_cars_data = 'kpi1_calculations.xlsx'  # calculations based on trafa data
df_raw_cars = pd.read_excel(path_cars_data)

df_raw_cars.columns = df_raw_cars.iloc[1]  # name columns after row
df_raw_cars = df_raw_cars.drop([0, 1])  # drop usless rows
df_raw_cars = df_raw_cars.reset_index(drop=True)

df_raw_cars['electricCarChangePercent'] = df_raw_cars['Procentenheter förändring av andel laddbara bilar 2015-2022']
df_raw_cars['electricCarChangeYearly'] = df_raw_cars.apply(
    lambda x: {2015: x[2015], 2016: x[2016], 2017: x[2017], 2018: x[2018], 2019: x[2019], 2020: x[2020], 2021: x[2021], 2022: x[2022]}, axis=1)

df_cars = df_raw_cars.filter(
    ['Kommun', 'electricCarChangePercent', 'electricCarChangeYearly'], axis=1)

df_master = df_master.merge(df_cars, on='Kommun', how='left')

# LOAD CLIMATE PLANS

path_plans_data = 'klimatplaner.xlsx'
df_plans = pd.read_excel(path_plans_data)

# name columns after row 1
df_plans.columns = df_plans.iloc[0]
df_plans = df_plans.drop(0)  # drop usless rows
df_plans = df_plans.reset_index(drop=True)

municipalities_w_s = ['Alingsås kommun', 'Bengtsfors kommun', 'Bollnäs kommun', 'Borås stad', 'Degerfors kommun', 'Grums kommun',
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
        return 'Gotland'

    # Remove 'kommun' or 'stad' from municipalities in the list 'municipalities_w_s'
    if kommun in municipalities_w_s:
        kommun = re.sub(r'( kommun| stad)', '', kommun)

    # Remove 'kommun', 'stad', 's kommun', or 's stad' from all other municipalities
    kommun = re.sub(r'( kommun| stad|s kommun|s stad)', '', kommun)

    return kommun


df_plans['Kommun'] = df_plans['Kommun'].apply(clean_kommun)

df_plans = df_plans.rename(
    columns={df_plans.columns[6]: 'cred'})

df_plans = df_plans.where(pd.notnull(df_plans), 'Saknas')

df_master = df_master.merge(df_plans, on='Kommun', how='left')

# LOAD CLIMATE PLANS

path_plans_data = 'klimatplaner.xlsx'
df_plans = pd.read_excel(path_plans_data)

# name columns after row 1
df_plans.columns = df_plans.iloc[0]
df_plans = df_plans.drop(0)  # drop usless rows
df_plans = df_plans.reset_index(drop=True)

municipalities_w_s = ['Alingsås kommun', 'Bengtsfors kommun', 'Bollnäs kommun', 'Borås stad', 'Degerfors kommun', 'Grums kommun',
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
        return 'Gotland'

    # Remove 'kommun' or 'stad' from municipalities in the list 'municipalities_w_s'
    if kommun in municipalities_w_s:
        kommun = re.sub(r'( kommun| stad)', '', kommun)

    # Remove 'kommun', 'stad', 's kommun', or 's stad' from all other municipalities
    kommun = re.sub(r'( kommun| stad|s kommun|s stad)', '', kommun)

    return kommun


df_plans['Kommun'] = df_plans['Kommun'].apply(clean_kommun)

df_plans = df_plans.rename(
    columns={df_plans.columns[6]: 'cred'})

df_plans = df_plans.where(pd.notnull(df_plans), 'Saknas')

df_master = df_master.merge(df_plans, on='Kommun', how='left')

# LOAD CLIMATE PLANS

path_plans_data = 'klimatplaner.xlsx'
df_plans = pd.read_excel(path_plans_data)

# name columns after row 1
df_plans.columns = df_plans.iloc[0]
df_plans = df_plans.drop(0)  # drop usless rows
df_plans = df_plans.reset_index(drop=True)

municipalities_w_s = ['Alingsås kommun', 'Bengtsfors kommun', 'Bollnäs kommun', 'Borås stad', 'Degerfors kommun', 'Grums kommun',
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
        return 'Gotland'

    # Remove 'kommun' or 'stad' from municipalities in the list 'municipalities_w_s'
    if kommun in municipalities_w_s:
        kommun = re.sub(r'( kommun| stad)', '', kommun)

    # Remove 'kommun', 'stad', 's kommun', or 's stad' from all other municipalities
    kommun = re.sub(r'( kommun| stad|s kommun|s stad)', '', kommun)

    return kommun


df_plans['Kommun'] = df_plans['Kommun'].apply(clean_kommun)

df_plans = df_plans.rename(
    columns={df_plans.columns[6]: 'cred'})

df_plans = df_plans.where(pd.notnull(df_plans), 'Saknas')

df_master = df_master.merge(df_plans, on='Kommun', how='left')

# MERGE ALL DATA IN LIST TO RULE THEM ALL

temp = []  # remane the columns
for i in range(len(df_cem)):
    temp.append({
        'kommun': df_master.iloc[i]['Kommun'],
        'emissions': {
            '1990': df_master.iloc[i][1990],
            '2000': df_master.iloc[i][2000],
            '2005': df_master.iloc[i][2005],
            '2010': df_master.iloc[i][2010],
            '2015': df_master.iloc[i][2015],
            '2016': df_master.iloc[i][2016],
            '2017': df_master.iloc[i][2017],
            '2018': df_master.iloc[i][2018],
            '2019': df_master.iloc[i][2019],
            '2020': df_master.iloc[i][2020]
        },
        'budget': df_master.iloc[i]['Budget'],
        'emissionBudget': df_master.iloc[i]['Paris Path'],
        'trend': df_master.iloc[i]['Linear Path'],
        'futureEmission': df_master.iloc[i]['Linear Emission'],
        'emissionChangePercent': df_master.iloc[i]['emissionChangePercent'],
        'hitNetZero': df_master.iloc[i]['hitNetZero'],
        'budgetRunsOut': df_master.iloc[i]['budgetRunsOut'],
        'electricCars': df_master.iloc[i]['electricCars'],
        'electricCarChangePercent': df_master.iloc[i]['electricCarChangePercent'],
        'electricCarChangeYearly': df_master.iloc[i]['electricCarChangeYearly'],
        'climatePlanContact': df_master.iloc[i]['Kontakt'],
        'climatePlanLink': df_master.iloc[i]['Länk till aktuell klimatplan'],
        'climatePlanYear': df_master.iloc[i]['Antagen år'],
        'climatePlanCred': df_master.iloc[i]['cred']
    })

with open('climate-data.json', 'w', encoding='utf8') as json_file:  # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)
