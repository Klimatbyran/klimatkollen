# -*- coding: utf-8 -*-

import datetime
from math import isnan
import numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta


# Budget in metric tonnes for January 2024
BUDGET = 170000000
BUDGET_YEAR = 2021
LAST_YEAR_IN_SMHI_DATA = 2021
DIFF_BUDGET_N_SMHI = BUDGET_YEAR-LAST_YEAR_IN_SMHI_DATA

PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2'

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

    return df_smhi


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


def subtract_past_years_from_budget(df):
    # Find all the years that has been reported after (and including) the year the budget starts "eating"
    year_budget_overlap_smhi = [i for i in df.columns if type(
        i) == int and i >= LAST_YEAR_IN_SMHI_DATA+1]
    return year_budget_overlap_smhi


def calculate_municipality_budgets(df):
    # Applying GF to get the share of the budget for each municipality
    years_range = range(2015, LAST_YEAR_IN_SMHI_DATA)
    df['budgetShare'] = [df[years_range].sum(axis=1)[i]/df[years_range].sum(
        axis=0).sum() for i in range(len(df))]

    year_budget_overlap_smhi = subtract_past_years_from_budget(df)

    # Each municipalities gets its share of the budget
    df['Budget'] = BUDGET*df['budgetShare']
    for i in range(len(year_budget_overlap_smhi)):
        # Subtracting years that have passed since the budget started "eating"
        df['Budget'] = df['Budget'] - df[year_budget_overlap_smhi[i]]

    return df


def calculate_paris_path(df):
    # Create an exponential curve that satisfy each municipality's budget
    temp = []
    for i in range(len(df)):
        dicts = {}  # We'll store the exponential path och each municipality in a dictionary where the keys are the years
        # We take the time horizon from the current year until 2050
        year_range = range(LAST_YEAR_IN_SMHI_DATA, 2050+1)
        for year in year_range:
            # Calculated what the emission level has to be at future date if one where to follow the exponential decay curve
            dicts[year] = df.iloc[i][LAST_YEAR_IN_SMHI_DATA] * \
                np.exp(-(df.iloc[i][LAST_YEAR_IN_SMHI_DATA]) /
                       (df.iloc[i]['Budget'])*(year-LAST_YEAR_IN_SMHI_DATA))
        temp.append(dicts)

    df['parisPath'] = temp  # add the exponential path to the dataframe

    df.to_excel('output/paths.xlsx', index=False)

    return df


def calculate_trend(df):
    # Create an exponential curve that satisfy each municipality's budget
    temp = []
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # Add the latest datapoint to the dict
        dicts = {LAST_YEAR_IN_SMHI_DATA: df.iloc[i][LAST_YEAR_IN_SMHI_DATA]}
        # Adding all the years we will use for the curve fit. This starts in 2015 to the latest year. NOTE: this can be changed
        x = np.arange(2015, LAST_YEAR_IN_SMHI_DATA+1)
        # Adding all the emissions from the respective years. Note is needs to be changed in parallel with the line above
        # 7:14 to access correct columns
        y = np.array(df.iloc[i][7:14], dtype=float)
        # Fit a straight line to the data defined above using least squares
        fit = np.polyfit(x, y, 1)

        # The rest of the keys for the dict we defined above. note that it starts at the latest plus 1 since we already have the latest in the dictionary already
        keys = range(LAST_YEAR_IN_SMHI_DATA+1, 2050+1)
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
        start = df.iloc[i]['parisPath'][LAST_YEAR_IN_SMHI_DATA+1]
        final = df.iloc[i]['parisPath'][LAST_YEAR_IN_SMHI_DATA+2]
        temp.append(((start-final)/start)*100)

    df['emissionChangePercent'] = temp
    return df


def calculate_hit_net_zero(df):
    # Create an exponential curve that satisfy each municipality's budget
    temp = []  # Temporary list that we will append to
    for i in range(len(df)):
        last_year = LAST_YEAR_IN_SMHI_DATA  # Year of the last datapoint
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


def calculate_budget_runs_out(df, budget_year): 
    # inparametrar, per kommun: storlek för kommunens utsläpp ett visst år (2023)
    #                           trendlinje (k-värde)
    #                           total CO2-budget

    # räkna ut totala utsläpp för trend för att se om kommunen håller budget
    temp_trend = []  # Temporary list that we will append to
    for i in range(len(df)):
        # Exclude the first DIFF_BUDGET_N_SMHI-1 elements from the trend dict
        trend_values = list(df.iloc[i]['trend'].values())[DIFF_BUDGET_N_SMHI-1:]
        trend_keys = list(df.iloc[i]['trend'].keys())[DIFF_BUDGET_N_SMHI-1:]

        # Applying the trapezoidal method to calculate the emission of the linear trend
        temp_trend.append(np.trapz(trend_values, trend_keys))

    df['kumulativ trend'] = temp_trend


    temp_dates = []  # Another temporary list that we will append to
    for i in range(len(df)):
        # beräkna k
        # Get the line coefficient for the trend between budget_year+1 and budget_year+2
        fit = np.polyfit([budget_year+1, budget_year+2], [df.iloc[i]['trend']
                         [budget_year+1], df.iloc[i]['trend'][budget_year+2]], 1)

        B = df.iloc[i]['Budget']-np.trapz(list(df.iloc[i]['trend'].values())[:2], list(
            df.iloc[i]['trend'].keys())[:2])  # Remove the "anomaly" from the budget

        # Find the value where the straight line cross the x-axis
        x = (np.sqrt(2*B*fit[0]+(fit[0]*(budget_year+1)+fit[1])**2)-fit[1])/(fit[0])

        # fixme fixa att halland har nan men går in i f.iloc[i]['kumulativ trend'] > df.iloc[i]['Budget']

        # Initiate the first day of our starting point date.
        # Start at budget_year+1 since the line can go up between budget_year and budget_year+1
        my_date = datetime.datetime(budget_year+1, 1, 1, 0, 0, 0)

        # If the trends cumulative emission is larger than the budget than the municipality will run out of budget
        if df.iloc[i]['kumulativ trend'] > df.iloc[i]['Budget']:
            print(df.iloc[i]['Kommun'])
            s = int((x-budget_year+2) * YEAR_SECONDS)
            temp_dates.append(
                (my_date + relativedelta(seconds=s)).date())
        else:
            temp_dates.append('Aldrig')

    df['budgetRunsOut'] = temp_dates
    return df


def emission_calculations(df):
    df_smhi = get_n_prep_data_from_smhi()
    df = df.merge(df_smhi, on='Kommun', how='left')

    df_cem = deduct_cement(df_smhi)
    df_budgeted = calculate_municipality_budgets(df_cem)
    df_paris = calculate_paris_path(df_budgeted)
    df_trend = calculate_trend(df_paris)

    df_change_percent = calculate_change_percent(df_trend)
    df_net_zero = calculate_hit_net_zero(df_change_percent)
    df_budget_runs_out = calculate_budget_runs_out(df_net_zero, BUDGET_YEAR)

    return df_budget_runs_out