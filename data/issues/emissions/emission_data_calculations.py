# pylint: disable=invalid-name
# -*- coding: utf-8 -*-

import datetime
import numpy as np
import pandas as pd
from dateutil.relativedelta import relativedelta

# Numbers below from
# https://www.cemus.uu.se/wp-content/uploads/2023/12/Paris-compliant-carbon-budgets-for-Swedens-counties-.pdf
# Found in tables on page 8 and 19

# National C02 budget in metric tonnes for 50% chance of staying below 1.5 degrees
NATIONAL_BUDGET_15 = 80000000
# National C02 budget in metric tonnes for 50% chance of staying below 1.7 degrees
NATIONAL_BUDGET_17 = 285113000
# National overhead for 1.7 degree scenario in metric tonnes
NATIONAL_OVERHEAD_17 = 53433+1364
# Year from which the carbon budgets applies
BUDGET_YEAR = 2024

# Year of today
CURRENT_YEAR = 2024

# Last year for which the National Emission database has data
LAST_YEAR_WITH_SMHI_DATA = 2022

PATH_SMHI = 'https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2'

YEAR_SECONDS = 60 * 60 * 24 * 365   # a year in seconds

CEMENT_DEDUCTION = {
    'Mörbylånga': {
        2010: 248025000/1000, 2015: 255970000/1000, 2016: 239538000/1000,
        2017: 255783000/1000, 2018: 241897000/1000, 2019: 65176000/1000,
        2020: 0, 2021: 0, 2022: 0
    },
    'Skövde': {
        2010: 356965000/1000, 2015: 358634000/1000, 2016: 384926000/1000,
        2017: 407633130/1000, 2018: 445630340/1000, 2019: 440504330/1000,
        2020: 459092473/1000, 2021: 439174727/1000, 2022: 406856000/1000
    },
    'Gotland': {
        2010: 1579811000/1000, 2015: 1926036000/1000, 2016: 1903887000/1000,
        2017: 1757110000/1000, 2018: 1740412000/1000, 2019: 1536480000/1000,
        2020: 1624463000/1000, 2021: 1621211000/1000, 2022: 1514132000/1000
    }
}

def subtract_national_overheads(national_budget_15, national_budget_17, national_overhead_17):
    """
    This function calculates national overheads for a 1.5 degree scenario carbon budget
    and then subtracts it from corresponding national carbon budget.
    It uses the known values for national CO2 budgets for 1.5 and 1.7 degree scenarios,
    as well as the national overhead for the 1.7 degree scenario.

    Returns:
        float: The calculated national CO2 budget for a 1.5 degree scenario.
    """

    # Calculate national overhead for 1.5 degree scenario in metric tonnes
    national_overhead_15 = (national_overhead_17/national_budget_17)*national_budget_15
    # Subtract national overhead from national budget for 1.5 degree scenario
    return national_budget_15-national_overhead_15

def get_n_prep_data_from_smhi(df):
    # Download data from SMHI and load it in to a pandas dataframe
    df_smhi = pd.read_excel(PATH_SMHI)

    # Remove the first 4 rows and reset the index
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


def deduct_cement(df, cement_deduction):
    # Sources for cement deduction
    # Mörbylånga: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=1441
    # Skövde: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=5932
    # Gotland: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=834

    df_cem = df.copy()  # copy dataframe

    # Deduct cement from given municipalities
    for i in cement_deduction.keys():
        for j in cement_deduction[i].keys():
            df_cem.loc[df_cem['Kommun'] == i, j] = df_cem.loc[
                df_cem['Kommun'] == i, j].values - cement_deduction[i][j]

    return df_cem


def calculate_trend_coefficients(df, last_year_in_range):
    # Calculate linear trend coefficients for municipailty based on SMHI data from 2015 onwards.
    # This is done by fitting a straight line to the data using least square fit.

    temp = [] # temporary list that we will append to
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # Get the years we will use for the curve fit.
        # NOTE: Years range can be changed
        x = np.arange(2015, last_year_in_range+1)
        # Get the emissions from the years specified in the line above
        y = np.array(df.iloc[i][x], dtype=float)
        # Fit a straight line to the data defined above using least squares
        fit = np.polyfit(x, y, 1)
        temp.append(fit)

    df['trendCoefficients'] = temp

    return df


def calculate_approximated_historical(df, last_year_in_range):
    # Calculate approximated historical data for years passed since the last year with SMHI data.
    # This is done by interpolation using previously calculated linear trend coefficients.

    # Get the years passed since last year with SMHI data (including current year)
    approximated_years = range(last_year_in_range+1, CURRENT_YEAR+1)

    temp = [] # temporary list that we will append to
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # We'll store the approximated values for each municipality
        # in a dictionary where the keys are the years
        years_dict = {}

        # Only fill dict if approximation is needed
        if len(list(approximated_years)) > 0:
            # Add the latest recorded datapoint to the dict.
            # The rest of the years will be added below
            years_dict = {last_year_in_range: df.iloc[i][last_year_in_range]}
            # Get trend coefficients
            fit = df.iloc[i]['trendCoefficients']

            for _, year in enumerate(approximated_years):
                # Add the approximated value for each year using the trend line coefficients.
                # Max function so we don't get negative values
                years_dict[year] = max(0, fit[0]*year+fit[1])

        temp.append(years_dict)

    df['approximatedHistorical'] = temp

    # Calculate the total emission from the approximated years using the trapezoidal rule
    temp = []
    for i in range(len(df)):
        temp.append(np.trapz(list(df.iloc[i]['approximatedHistorical'].values()), list(
            df.iloc[i]['approximatedHistorical'].keys())))

    df['totalApproximatedHistorical'] = temp

    return df


def calculate_trend(df, last_year_in_range):
    # Calculate trend line for future years up to 2050
    # This is done by interpolation using previously calculated linear trend coefficients

    # Get years between next year and 2050
    future_years = range(CURRENT_YEAR+1, 2050+1)

    temp = []     # temporary list that we will append to
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # We'll store the trend line for each municipality in a dictionary with years as keys
        # Add the latest recorded datapoint to the dict. The rest of the years will be added below.
        dict = {last_year_in_range: df.iloc[i][last_year_in_range]}

        # If approximated historical values exist, overwrite trend dict to start from current year
        if CURRENT_YEAR > last_year_in_range:
            dict = {CURRENT_YEAR: df.iloc[i]['approximatedHistorical'][CURRENT_YEAR]}

        # Get the trend coefficients
        fit = df.iloc[i]['trendCoefficients']

        for _, year in enumerate(future_years):
            # Add the trend value for each year using the trend line coefficients.
            # Max function so we don't get negative values
            dict[year] = max(0, fit[0]*year+fit[1])
        temp.append(dict)

    df['trend'] = temp

    # Calculate the total emission from the linear trend using the trapezoidal rule
    temp = []
    for i in range(len(df)):
        temp.append(np.trapz(list(df.iloc[i]['trend'].values()), list(
            df.iloc[i]['trend'].keys())))

    df['trendEmission'] = temp

    return df


def calculate_municipality_budgets(df, last_year_in_range):
    # Apply GF (grand fathering) to get the share of the budget for each municipality
    # GF is based on SMHI data from 2015 onwards
    years_range_gf = range(2015, last_year_in_range+1)
    df["budgetShare"] = df[years_range_gf].sum(axis=1) / df[years_range_gf].sum(axis=0).sum()

    # Each municipality gets its share of the budget
    df['Budget'] = BUDGET*df['budgetShare']

     # Get years passed since the year the budget starts "eating"
    all_years_since_budget = list(range(BUDGET_YEAR, CURRENT_YEAR))

    # Separate years with recorded data from years with approximated data
    recorded_years_since_budget = [x for x in all_years_since_budget if x <= last_year_in_range]
    approximated_years_since_budget = [x for x in all_years_since_budget if x > last_year_in_range]

    # Subtract emissions from budget for years that have passed since the budget started "eating"
    # For recorded values, subtract values as is
    for i in range(len(recorded_years_since_budget)): 
        df['Budget'] = df['Budget'] - df[recorded_years_since_budget[i]]

    # For approximated values, subtract total emission from approximated years since budget
    temp = []
    if len(approximated_years_since_budget) > 0:
        for i in range(len(df)):
            # Get index in approximated historical series for
            # the year from which emissions need to be subtracted
            approximated_years = list(df.iloc[i]['approximatedHistorical'].keys())
            start_subtract_year_idx = approximated_years.index(approximated_years_since_budget[0])
            # Get approximated values and years since budget
            y_approx = list(df.iloc[i]['approximatedHistorical'].values())[start_subtract_year_idx:]
            x_approx = list(df.iloc[i]['approximatedHistorical'].keys())[start_subtract_year_idx:]

            # Get the cumulative emissions from the approximated historical data,
            # starting from the year approximated values needs to be subtracted from the budget
            approx_emissions_since_budget = np.trapz(y_approx, x_approx)

            temp.append(approx_emissions_since_budget)
        df['Budget'] = df['Budget'] - temp

    return df


def calculate_paris_path(df):
    # Create an exponential curve that satisfy each municipality's budget

    # Year from which the budget applies (after correction with respect to years passed since budget start)
    first_year = max(BUDGET_YEAR, CURRENT_YEAR)

    temp = []
    for i in range(len(df)):
        # We'll store the exponential path for each municipality in a dictionary where the keys are the years
        dicts = {} 
        # Years range will be set to from when the budget applies until 2050
        years_range = range(first_year, 2050+1)
        
        for year in years_range:
            # Calculate what the emission level has to be at future year if one were to follow the exponential decay curve
            if (first_year <= LAST_YEAR_WITH_SMHI_DATA): # If data has been recorded for the year the budget kicks in, use recorded values
                dicts[year] = df.iloc[i][first_year] * \
                    np.exp(-(df.iloc[i][first_year]) /
                        (df.iloc[i]['Budget'])*(year-first_year))
            else: # If no data has been recorded for the year the budget kicks in, use trend values
                dicts[year] = df.iloc[i]['trend'][first_year] * \
                    np.exp(-(df.iloc[i]['trend'][first_year]) /
                        (df.iloc[i]['Budget'])*(year-first_year))
        temp.append(dicts)

    df['parisPath'] = temp 

    return df

def calculate_historical_change_percent(df, last_year_in_range):
    # Calculate the historical average emission level change based on SMHI data from 2015 onwards

    temp = []
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # Get the years we will use for the average
        years = np.arange(2015, last_year_in_range+1)
        # Get the emissions from the years specified in the line above
        emissions = np.array(df.iloc[i][years], dtype=float)
        # Calculate diff (in percent) between each succesive year
        diffs_in_percent = [(x - emissions[i - 1])/emissions[i - 1]
                            for i, x in enumerate(emissions)][1:]
        # Calculate average diff
        avg_diff_in_percent = 100 * sum(diffs_in_percent) / len(diffs_in_percent)

        temp.append(avg_diff_in_percent)

    df['historicalEmissionChangePercent'] = temp

    return df

def calculate_needed_change_percent(df):
    # Calculate needed yearly emission level decrease to reach Paris goal
   
    # Year from which the paris path starts
    first_year = max(BUDGET_YEAR, CURRENT_YEAR)
    
    temp = []
    for i in range(len(df)):
        # arbitrarily chosen years
        start = df.iloc[i]['parisPath'][first_year+1]
        final = df.iloc[i]['parisPath'][first_year+2]
        temp.append(((start-final)/start)*100)

    df['neededEmissionChangePercent'] = temp
    return df


def calculate_hit_net_zero(df):
    # Calculate the date and year for when each municipality hits net zero emissions (if so). 
    # This is done by deriving where the linear trend line crosses the time axis.
    
    temp = []  # temporary list that we will append to
    for i in range(len(df)):
        last_year = LAST_YEAR_WITH_SMHI_DATA  # last year with recorded data
        # Get trend line coefficients
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
    # Calculate the year and date for when the CO2 budget runs out for each municipality (if so). 
    # This is done by integrating the trend line over the time it takes for the budget to be consumed 
    # and see where we are at the time axis by that point.
    
    # Year from which the budget applies (after correction with respect to years passed since budget start)
    budget_start_year = max(BUDGET_YEAR, CURRENT_YEAR)

    temp = []  # temporary list that we will append to
    for i in range(len(df)):
        # Get index in trend series for budget_start_year
        trend_years = list(df.iloc[i]['trend'].keys())
        budget_start_year_idx = trend_years.index(budget_start_year)
        # Get trend values for from budget_start_year onwards
        y_trend = list(df.iloc[i]['trend'].values())[budget_start_year_idx:]
        x_trend = list(df.iloc[i]['trend'].keys())[budget_start_year_idx:]
        
        # Get the cumulative emissions from the trend line, starting from the year the corrected budget applies (from budget_start_year onwards)
        cumulative_emissions = np.trapz(y_trend, x_trend)

        # If the trends cumulative emission is larger than the budget, the municipality will run out of budget
        if cumulative_emissions > df.iloc[i]['Budget']:
            # Get the line coefficients for the trend line
            fit = df.iloc[i]['trendCoefficients']

            # Remove the "anomaly" from the budget (if any)
            # Subtract emission from trend between budget_start_year and budget_start_year+1 since the line can go up between budget_start_year and budget_start_year+1 if BUDGET_YEAR == LAST_YEAR_WITH_SMHI_DATA
            B = df.iloc[i]['Budget'] - np.trapz(y_trend[:2], x_trend[:2])
            start_year_after_correction = budget_start_year+1

            # Find the value where the budget B has been consumed
            # by solving -1/2(x1-x2)(2m+k(x1+x2))=B for x2 where x1=start_year_after_correction 
            x = (np.sqrt(2*B*fit[0]+(fit[0]*start_year_after_correction+fit[1])**2)-fit[1])/(fit[0])

            # Initiate the first day of our starting point date
            my_date = datetime.datetime(start_year_after_correction, 1, 1, 0, 0, 0)
            # Calculate the time diff between starting date and point in time where budget runs out
            time_diff_in_years = x - (start_year_after_correction)
            time_diff_in_seconds = int(time_diff_in_years*YEAR_SECONDS)
            # Add diff to starting date to get date for when budget runs out
            budget_runs_out_date = (my_date + relativedelta(seconds=time_diff_in_seconds)).date()
            
            temp.append(budget_runs_out_date)
        else:
            temp.append('Håller budget')
            
    df['budgetRunsOut'] = temp
    
    return df


def emission_calculations(df):
    df_smhi = get_n_prep_data_from_smhi(df)
    df_cem = deduct_cement(df_smhi, CEMENT_DEDUCTION)

    df_trend_coefficients = calculate_trend_coefficients(df_cem, LAST_YEAR_WITH_SMHI_DATA)
    df_approxmimated_historical = calculate_approximated_historical(
        df_trend_coefficients, LAST_YEAR_WITH_SMHI_DATA)
    df_trend = calculate_trend(df_approxmimated_historical, LAST_YEAR_WITH_SMHI_DATA)

    df_budgeted = calculate_municipality_budgets(df_trend, LAST_YEAR_WITH_SMHI_DATA)
    df_paris = calculate_paris_path(df_budgeted)

    df_historical_change_percent = calculate_historical_change_percent(
        df_paris, LAST_YEAR_WITH_SMHI_DATA)
    df_needed_change_percent = calculate_needed_change_percent(df_historical_change_percent)

    df_net_zero = calculate_hit_net_zero(df_needed_change_percent)
    df_budget_runs_out = calculate_budget_runs_out(df_net_zero)

    return df_budget_runs_out
