# -*- coding: utf-8 -*-

import datetime
from math import isnan
import numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta


# Budget in metric tonnes from 2020 +40948459*50.81/46.29+40948459*50.81/46.29*1.05
BUDGET = 170000000
CURRENT_YEAR = 2021

PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2'
PATH_CRUNCHED_DATA = 'issues/emissions/output_extra.xlsx'

YEAR_OFFSET = 1
YEAR_SECONDS = 60 * 60 * 24 * 365  # a year in seconds


def get_n_prep_data_from_smhi():
    # Download data from SMHI and load it in to a pandas dataframe
    df_smhi = pd.read_excel(PATH_SMHI)

    # remove the first 4 rows and reset the index
    df_smhi = df_smhi.drop([0, 1, 2]).reset_index(drop=True)

    # Put the first 4 elements in row 1 in to row 0
    df_smhi.iloc[0, [0, 1, 2, 3]] = df_smhi.iloc[1, [0, 1, 2, 3]]

    df_smhi = df_smhi.drop([1]).reset_index(
        drop=True)  # remove row 1 and reset the index

    # Change the column names to the first rows entries
    df_smhi = df_smhi.rename(columns=df_smhi.iloc[0])
    df_smhi = df_smhi.drop([0])  # remove row 0

    df_smhi = df_smhi[(df_smhi['Huvudsektor'] == 'Alla') & (df_smhi['Undersektor'] == 'Alla')
                      & (df_smhi['Län'] != 'Alla') & (df_smhi['Kommun'] != 'Alla')]
    df_smhi = df_smhi.reset_index(drop=True)

    # Remove said columns
    df_smhi = df_smhi.drop(columns=['Huvudsektor', 'Undersektor', 'Län'])
    df_smhi = df_smhi.sort_values(by=['Kommun'])  # sort by Kommun
    df_smhi = df_smhi.reset_index(drop=True)

    df = df.merge(df_smhi, on='Kommun', how='left')

    return df


def deduct_cement(df):
    # Sources for cement deduction
    # Mörbylånga: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=1441
    # Skövde: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=5932
    # Gotland: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=834

    df_cem = df.copy()  # copy dataframe

    cement_deduction = {'Mörbylånga':
                        {2010: 248025000/1000, 2015: 255970000/1000, 2016: 239538000/1000,
                         2017: 255783000/1000, 2018: 241897000/1000, 2019: 65176000/1000, 2020: 0, 2021: 0},
                        'Skövde':
                        {2010: 356965000/1000, 2015: 358634000/1000, 2016: 384926000/1000, 2017: 407633130 /
                         1000, 2018: 445630340/1000, 2019: 440504330/1000, 2020: 459092473/1000, 2021: 439174727/1000},
                        'Gotland':
                        {2010: 1579811000/1000, 2015: 1926036000/1000, 2016: 1903887000/1000, 2017: 1757110000 /
                         1000, 2018: 1740412000/1000, 2019: 1536480000/1000, 2020: 1624463000/1000, 2021: 1621211000/1000}
                        }

    # Deduct cement from given municipalities
    for i in cement_deduction.keys():
        for j in cement_deduction[i].keys():
            df_cem.loc[df_cem['Kommun'] == i, j] = df_cem.loc[df_cem['Kommun']
                                                              == i, j].values - cement_deduction[i][j]

    return df_cem


def calculate_municipality_budgets(df):
    # Applying GF to get the share of the budget for each municipality
    years_range = range(2015, CURRENT_YEAR)
    df['budgetShare'] = [df[years_range].sum(axis=1)[i]/df[years_range].sum(
        axis=0).sum() for i in range(len(df))]

    # Find all the years that has been reported after (and including) the year the budget starts "eating"
    years_past = [i for i in df.columns if type(
        i) == int and i >= CURRENT_YEAR]

    # Each municipalities gets its share of the budget
    df['Budget'] = BUDGET*df['budgetShare']
    for i in range(len(years_past)):
        # Subtracting years that have passed since the budget started "eating"
        df['Budget'] = df['Budget'] - df[years_past[i]]

    return df


def calculate_paris_path(df):
    # Find all the years that has been reported after (and including) the year the budget starts "eating"
    years_past = [i for i in df.columns if type(
        i) == int and i >= CURRENT_YEAR]

    # Create an exponential curve that satisfy each municipality's budget
    temp = []
    latest = int(sorted(years_past)[-1])  # The latest year in the dataframe
    for i in range(len(df)):
        dicts = {}  # We'll store the exponential path och each municipality in a dictionary where the keys are the years
        # We take the time horizon from the latest year until 2050
        keys = range(latest, 2050+1)
        for value in keys:
            # Calculated what the emission level has to be at future date if one where to follow the exponential decay curve
            dicts[value] = df.iloc[i][latest] * \
                np.exp(-(df.iloc[i][latest]) /
                       (df.iloc[i]['Budget'])*(value-latest))
        temp.append(dicts)

    df['parisPath'] = temp  # add the exponential path to the dataframe

    return df


def calculate_trend(df):
    # Find all the years that has been reported after (and including) the year the budget starts "eating"
    years_past = [i for i in df.columns if type(
        i) == int and i >= CURRENT_YEAR]

    # Create an exponential curve that satisfy each municipality's budget
    temp = []
    latest = int(sorted(years_past)[-1])  # The latest year in the dataframe
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # Add the latest datapoint to the dict
        dicts = {latest: df.iloc[i][latest]}
        # Adding all the years we will use for the curve fit. This starts in 2015 to the latest year. NOTE: this can be changed
        x = np.arange(2015, latest+1)
        # Adding all the emissions from the respective years. Note is needs to be changed in parallel with the line above
        # 7:14 to access correct columns
        y = np.array(df.iloc[i][7:14], dtype=float)
        # Fit a straight line to the data defined above using least squares
        fit = np.polyfit(x, y, 1)

        # The rest of the keys for the dict we defined above. note that it starts at the latest plus 1 since we already have the latest in the dictionary already
        keys = range(latest+1, 2050+1)
        for idx, value in enumerate(keys):
            # Add the value for each year using the coefficient from the fit above. Max function so we don't get negative values
            dicts[value] = max(0, fit[0]*value+fit[1])
        temp.append(dicts)

    df['trend'] = temp

    # Calculate the emission from the linear trend using the trapezoidal rule
    temp = []
    for i in range(len(df)):
        temp.append(np.trapz(list(df.iloc[i]['trend'].values()), list(
            df.iloc[i]['trend'].keys())))

    # Add the emission form the linear trend to the dataframe
    df['trendEmission'] = temp

    return df


def calculate_change_percent(df):
    # Calculate what yearly decrease that is needed to reach Paris goal
    temp = []
    for i in range(len(df)):
        # arbitrarily chosen years
        start = df.iloc[i]['parisPath'][CURRENT_YEAR+1]
        final = df.iloc[i]['parisPath'][CURRENT_YEAR+2]
        temp.append(((start-final)/start)*100)

    df['emissionChangePercent'] = temp
    return df


def calculate_hit_net_zero(df):
    # Find all the years that has been reported after (and including) the year the budget starts "eating"
    years_past = [i for i in df.columns if type(
        i) == int and i >= CURRENT_YEAR]

    # Create an exponential curve that satisfy each municipality's budget
    temp = []
    latest = int(sorted(years_past)[-1])  # The latest year in the dataframe

    temp = []  # Temporary list that we will append to
    for i in range(len(df)):
        last_year = latest  # Year of the last datapoint
        # We start at the last year +1 since if you look at the figure above of the linear trend you can see that from last year to last year +1 the line can go upwards.
        fit = np.polyfit([last_year+1, last_year+2], [df.iloc[i]['trend']
                         [last_year+1], df.iloc[i]['trend'][last_year+2]], 1)

        if fit[0] < 0:  # If the slope is negative we will reach the x-axis
            temp_f = -fit[1]/fit[0]  # Find where the line cross the x-axis
            # Initiate the first day of our starting point date. Start at last_year+1 since the line can go up between last_year and last_year+1
            my_date = datetime.datetime(int(last_year+1), 1, 1, 0, 0, 0)
            # Add the length between the starting date and the net zero date to the starting date to get the date when net zero is reached
            temp.append(
                (my_date + relativedelta(seconds=int((temp_f-int(last_year+1)) * YEAR_SECONDS))).date())

        else:  # If the slope is not negative you will never reach net zero
            temp.append('Aldrig')

    df['hitNetZero'] = temp
    return df


def calculate_budget_runs_out(df):
    last_year = CURRENT_YEAR  # Year of the last datapoint

    temp = []  # Temporary list that we will append to
    for i in range(len(df)):
        # Applying the trapezoidal method to calculate the emission of the linear trend
        temp.append(np.trapz(list(df.iloc[i]['trend'].values()), list(
            df.iloc[i]['trend'].keys())))

    df['kumulativt'] = temp

    temp = []  # Temporary list that we will append to

    for i in range(len(df)):
        # Get the line coefficient for the trend betwwne last_year+1 and last_year+2
        fit = np.polyfit([last_year+1, last_year+2], [df.iloc[i]['trend']
                         [last_year+1], df.iloc[i]['trend'][last_year+2]], 1)

        B = df.iloc[i]['Budget']-np.trapz(list(df.iloc[i]['trend'].values())[:2], list(
            df.iloc[i]['trend'].keys())[:2])  # Remove the "anomaly" from the budget

        # Find the value where the straight line cross the x-axis
        x = (
            np.sqrt(2*B*fit[0]+(fit[0]*(last_year+1)+fit[1])**2)-fit[1])/(fit[0])

        # Initiate the first day of our starting point date. Start at last_year+1 since the line can go up between last_year and last_year+1
        my_date = datetime.datetime(last_year+1, 1, 1, 0, 0, 0)

        # If the trends cumulative emission is larger than the budget than the municipality will run out of budget
        if df.iloc[i]['kumulativt'] > df.iloc[i]['Budget']:
            temp.append(
                (my_date + relativedelta(seconds=int((x-last_year+2) * YEAR_SECONDS))).date())
        else:
            temp.append('Aldrig')

    df['budgetRunsOut'] = temp
    return df


def emission_calculations(df=None):
    df_smhi = get_n_prep_data_from_smhi()

    #df = df.merge(df_smhi, on='Kommun', how='left')

    df_cem = deduct_cement(df_smhi)
    df_budgeted = calculate_municipality_budgets(df_cem)
    df_paris = calculate_paris_path(df_budgeted)
    df_trend = calculate_trend(df_paris)

    df_change_percent = calculate_change_percent(df_trend)
    df_net_zero = calculate_hit_net_zero(df_change_percent)
    df_budget_runs_out = calculate_budget_runs_out(df_net_zero)

    return df_budget_runs_out


df = emission_calculations()

print(df.head())