# -*- coding: utf-8 -*-

import datetime
import numpy as np
import pandas as pd


# Budget in metric tonnes from 2020 +40948459*50.81/46.29+40948459*50.81/46.29*1.05
BUDGET = 170000000
PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2'
PATH_CRUNCHED_DATA = 'emissions/output_extra.xlsx'


def get_n_prep_data_from_smhi():
    # Download data from SMHI and load it in to a pandas dataframe
    df = pd.read_excel(PATH_SMHI)

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

    return df


def deduct_cement(df):
    # https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=1441 Sources for cement deduction
    # https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=5932
    # https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=834

    df_cem = df.copy()  # copy dataframe

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

    # Deduct cement from given kommuns
    for i in cement_deduction.keys():
        for j in cement_deduction[i].keys():
            df_cem.loc[df_cem['Kommun'] == i, j] = df_cem.loc[df_cem['Kommun']
                                                              == i, j].values - cement_deduction[i][j]

    return df_cem


def calculate_municipality_budgets(df):
   # Calculate each kommuns procentage of the total budget using grandfathering
    year_range = [2015, 2016, 2017, 2018, 2019]
    df['Andel'] = [df[year_range].sum(axis=1)[i]/df[year_range].sum(
        axis=0).sum() for i in range(len(df))]

    # Update each kommuns budget given the new 2020 data
    df['Budget'] = BUDGET*df['Andel']-df[2020]

    return df


def calculate_municiplaity_paris_path(df):
    # Create an exponential curve that satisfy each kommuns budget
    temp = []
    for i in range(len(df)):
        dicts = {}
        keys = range(2020, 2050+1)
        for idx, value in enumerate(keys):
            dicts[value] = df.iloc[i][2020] * \
                np.exp(-(df.iloc[i][2020])/(df.iloc[i]['Budget'])*idx)
        temp.append(dicts)

    df['Paris Path'] = temp  # add the exponential path to the dataframe

    return df


def calculate_linear_emissions(df):
    # Calculate the linerar trend
    temp = []
    for i in range(len(df)):
        dicts = {2020: df.iloc[i][2020]}
        x = np.arange(2015, 2020+1)
        y = np.array(df.iloc[i][5:10+1], dtype=float)
        fit = np.polyfit(x, y, 1)

        keys = range(2021, 2050+1)
        for idx, value in enumerate(keys):
            dicts[value] = max(0, fit[0]*value+fit[1])
        temp.append(dicts)

    df['Linear Path'] = temp  # add the linear trend to the dataframe

    # Calculate the emission from the linear trend using the trapezoidal rule
    temp = []
    for i in range(len(df)):
        temp.append(np.trapz(list(df.iloc[i]['Linear Path'].values()), list(
            df.iloc[i]['Linear Path'].keys())))

    # Add the emission form the linear trend to the dataframe
    df['Linear Emission'] = temp

    return df


def emission_calculations():
    df_smhi = get_n_prep_data_from_smhi()
    df_cem = deduct_cement(df_smhi)
    df_budgeted = calculate_municipality_budgets(df_cem)
    df_paris = calculate_municiplaity_paris_path(df_budgeted)
    df_linear = calculate_linear_emissions(df_paris)

    # LOAD CRUNCHED DATA FROM CLIMATE VIEW
    # fix while rest of calculations are missing

    df_raw_crunched = pd.read_excel(PATH_CRUNCHED_DATA)

    df_raw_crunched['emissionChangePercent'] = df_raw_crunched['Procent minskning varje år med exponentiellt avtagande bana']
    df_raw_crunched['hitNetZero'] = [i.date() if type(
        i) is datetime.datetime else i for i in df_raw_crunched['När netto noll nås']]
    df_raw_crunched['budgetRunsOut'] = [i.date() if type(
        i) is datetime.datetime else i for i in df_raw_crunched['Budget tar slut']]

    df_crunched = df_raw_crunched.filter(
        ['Kommun', 'emissionChangePercent', 'hitNetZero', 'budgetRunsOut'], axis=1)

    df_linear = df_cem.merge(df_crunched, on='Kommun', how='left')

    return df_linear
