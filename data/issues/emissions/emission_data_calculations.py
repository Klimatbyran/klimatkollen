# -*- coding: utf-8 -*-

import datetime
import numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta

BUDGET = 80000000                # C02 budget in metric tonnes 
BUDGET_YEAR = 2024               # year from which the budget applies

LAST_YEAR_WITH_SMHI_DATA = 2021 # last year for which the National Emission database has data
PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2'

YEAR_SECONDS = 60 * 60 * 24 * 365  # a year in seconds


def get_n_prep_data_from_smhi(df):
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
    # Applying GF (grand fathering) to get the share of the budget for each municipality, based on SMHI data from 2015 onwards
    years_range_gf = range(2015, LAST_YEAR_WITH_SMHI_DATA)
    df['budgetShare'] = [df[years_range_gf].sum(axis=1)[i]/df[years_range_gf].sum(
        axis=0).sum() for i in range(len(df))]
    
    # Each municipalities gets its share of the budget
    df['Budget'] = BUDGET*df['budgetShare']

    # Find all the years that has been reported after (and including) the year the budget starts "eating"
    reported_years_since_budget = range(BUDGET_YEAR, LAST_YEAR_WITH_SMHI_DATA+1)
    for i in range(len(reported_years_since_budget)):
        # Subtracting years that have passed since the budget started "eating"
        df['Budget'] = df['Budget'] - df[reported_years_since_budget[i]]

    return df


def calculate_trend(df):
    # Calculate linear trend based on SMHI data from 2015 to last year having data. Then store 
    # trend coefficients, trend line values and accumulated trend emission for each municipality
    
    # Temporary lists that we will append to
    temp_fit = []
    temp_trend = []
    
    last_year_with_data = LAST_YEAR_WITH_SMHI_DATA  # the last year with recorded data
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # We'll store the trend line for each municipality in a dictionary where the keys are the years
        # Add the latest recorded datapoint to the dict 
        dicts = {last_year_with_data: df.iloc[i][last_year_with_data]}
        
        # Get the years we will use for the curve fit. This starts in 2015 and goes to the latest year having data. 
        # NOTE: Years range can be changed
        x = np.arange(2015, last_year_with_data+1)
        # Get the emissions from the respective years specified in the line above. 
        y = np.array(df.iloc[i][x], dtype=float)
        # Fit a straight line to the data defined above using least squares
        fit = np.polyfit(x, y, 1)
        temp_fit.append(fit)

        # The rest of the keys (years) for the dict are added below 
        # NOTE: It starts at last year + 1 since we already have the last in the dictionary
        trend_line_years = range(last_year_with_data+1, 2050+1)
        for idx, year in enumerate(trend_line_years):
            # Add the value for each year using the coefficient from the fit above. Max function so we don't get negative values
            dicts[year] = max(0, fit[0]*year+fit[1])
        temp_trend.append(dicts)

    # Add the trend coefficients and values to the dataframe
    df['trendCoefficients'] = temp_fit
    df['trend'] = temp_trend

    # Calculate the emission from the linear trend using the trapezoidal rule
    temp = []
    for i in range(len(df)):
        temp.append(np.trapz(list(df.iloc[i]['trend'].values()), list(
            df.iloc[i]['trend'].keys())))

    # Add the total emission from the linear trend to the dataframe
    df['trendEmission'] = temp

    return df


def calculate_paris_path(df):
    # Create an exponential curve that satisfy each municipality's budget
    temp = []
    # Year from which the budget applies (after correction with respect to reported years since budget start)
    first_year = max(LAST_YEAR_WITH_SMHI_DATA, BUDGET_YEAR)  
    for i in range(len(df)):
        # We'll store the exponential path for each municipality in a dictionary where the keys are the years
        dicts = {} 
        # Years range will be set to be from when the budget applies, until 2050
        years_range = range(first_year, 2050+1)
        for year in years_range:
            # Calculate what the emission level has to be at future date if one were to follow the exponential decay curve
            if (first_year <= LAST_YEAR_WITH_SMHI_DATA): # If data has been recorded the year budget kicks in, use these values
                dicts[year] = df.iloc[i][first_year] * \
                    np.exp(-(df.iloc[i][first_year]) /
                        (df.iloc[i]['Budget'])*(year-first_year))
            else: # If no data has not yet been recorded for year when bugdget kicks in, use trend values
                dicts[year] = df.iloc[i]['trend'][first_year] * \
                    np.exp(-(df.iloc[i]['trend'][first_year]) /
                        (df.iloc[i]['Budget'])*(year-first_year))
        temp.append(dicts)

    df['parisPath'] = temp  # add the exponential path to the dataframe

    return df


def calculate_change_percent(df):
    # Calculate what yearly decrease that is needed to reach Paris goal
    temp = []
    # Year from which the paris path starts
    first_year = max(LAST_YEAR_WITH_SMHI_DATA, BUDGET_YEAR)  
    for i in range(len(df)):
        # arbitrarily chosen years
        start = df.iloc[i]['parisPath'][first_year+1]
        final = df.iloc[i]['parisPath'][first_year+2]
        temp.append(((start-final)/start)*100)

    df['emissionChangePercent'] = temp
    return df


def calculate_hit_net_zero(df):
    temp = []  # Temporary list that we will append to
    for i in range(len(df)):
        last_year = LAST_YEAR_WITH_SMHI_DATA  # Year of the last datapoint
        # Get trend line coefficients for specified municipality from df
        fit = df.iloc[i]['trendCoefficients']

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
    # Year from which the budget applies (after correction with respect to reported years since budget start)
    budget_start_year = max(LAST_YEAR_WITH_SMHI_DATA, BUDGET_YEAR)  

    temp = []  # Temporary list that we will append to
    for i in range(len(df)):
        # Get index in trend series for budget_start_year
        trend_years = list(df.iloc[i]['trend'].keys())
        budget_start_year_idx = trend_years.index(budget_start_year)
        # Get trend values for budget_start_year and forward
        y_trend = list(df.iloc[i]['trend'].values())[budget_start_year_idx:]
        x_trend = list(df.iloc[i]['trend'].keys())[budget_start_year_idx:]
        
        # Get the cumulative emissions from the trend line, starting from the year the corrected budget applies (budget_start_year and forward)
        cumulative_emissions = np.trapz(y_trend, x_trend)

        # If the trends cumulative emission is larger than the budget than the municipality will run out of budget
        if cumulative_emissions > df.iloc[i]['Budget']:
            # Calculate date for when the budget runs out
            
            # Get the line coefficients for the trend line from df
            fit = df.iloc[i]['trendCoefficients']

            # Remove the "anomaly" from the budget (if any)
            # Subtract emission from trend between budget_start_year and budget_start_year+1 since the line can go up between budget_start_year and budget_start_year+1 if BUDGET_YEAR == LAST_YEAR_WITH_SMHI_DATA
            B = df.iloc[i]['Budget'] - np.trapz(y_trend[:2], x_trend[:2])
            start_year_after_correction = budget_start_year+1

            # Find the value where the straight line cross the x-axis 
            # by solving -1/2(x1-x2)(2m+k(x1+x2))=B for x2 where x1=budget_start_year+1 
            x = (np.sqrt(2*B*fit[0]+(fit[0]*(budget_start_year+1)+fit[1])**2)-fit[1])/(fit[0])

            # Initiate the first day of our starting point date
            my_date = datetime.datetime(start_year_after_correction, 1, 1, 0, 0, 0)
            # Calculate the time diff between starting date and point in time where budget runs out
            time_diff_in_years = x - (start_year_after_correction)
            time_diff_in_seconds = int(time_diff_in_years*YEAR_SECONDS)
            # Add diff to starting date to get date for when budget runs out
            budget_runs_out_date = (my_date + relativedelta(seconds=time_diff_in_seconds)).date()
            
            temp.append(budget_runs_out_date)
        else:
            temp.append('Aldrig')
            
    df['budgetRunsOut'] = temp
    
    return df


def emission_calculations(df):
    df_smhi = get_n_prep_data_from_smhi(df)
    df_cem = deduct_cement(df_smhi)
    df_budgeted = calculate_municipality_budgets(df_cem)
    df_trend = calculate_trend(df_budgeted)
    df_paris = calculate_paris_path(df_trend)

    df_change_percent = calculate_change_percent(df_paris)
    df_net_zero = calculate_hit_net_zero(df_change_percent)
    df_budget_runs_out = calculate_budget_runs_out(df_net_zero)

    return df_budget_runs_out
