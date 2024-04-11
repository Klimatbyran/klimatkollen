# -*- coding: utf-8 -*-

import datetime
from dateutil.relativedelta import relativedelta
import numpy as np
import pandas as pd
from issues.emissions.historical_data_calculations import get_n_prep_data_from_smhi
from issues.emissions.approximated_data_calculations import calculate_approximated_historical
from issues.emissions.trend_calculations import calculate_trend_coefficients, calculate_trend


BUDGET = 80000000                # C02 budget in metric tonnes
BUDGET_YEAR = 2024               # year from which the budget applies

LAST_YEAR_WITH_SMHI_DATA = 2021  # last year for which the National Emission database has data

CURRENT_YEAR = 2024              # current year

YEAR_SECONDS = 60 * 60 * 24 * 365   # a year in seconds


def get_cement_deduction():
    return  {'Mörbylånga':
            {2010: 248025000/1000, 2015: 255970000/1000, 2016: 239538000/1000,
                2017: 255783000/1000, 2018: 241897000/1000, 2019: 65176000/1000,
                2020: 0, 2021: 0},
            'Skövde':
            {2010: 356965000/1000, 2015: 358634000/1000, 2016: 384926000/1000,
                2017: 407633130/1000, 2018: 445630340/1000, 2019: 440504330/1000,
                2020: 459092473/1000, 2021: 439174727/1000},
            'Gotland':
            {2010: 1579811000/1000, 2015: 1926036000/1000, 2016: 1903887000/1000,
                2017: 1757110000/1000, 2018: 1740412000/1000, 2019: 1536480000/1000,
                2020: 1624463000/1000, 2021: 1621211000/1000}
            }


def deduct_cement(df):
    # Sources for cement deduction
    # Mörbylånga: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=1441
    # Skövde: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=5932
    # Gotland: https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=834

    df_cem = df.copy()
    cement_deduction = get_cement_deduction()

    # Deduct cement from given municipalities
    for i in cement_deduction.keys():
        for j in cement_deduction[i].keys():
            df_cem.loc[df_cem['Kommun'] == i, j] = df_cem.loc[
                df_cem['Kommun'] == i, j].values - cement_deduction[i][j]

    return df_cem


def calculate_municipality_budgets(df):
    # Apply GF (grand fathering) to get the share of the budget for each municipality
    # GF is based on SMHI data from 2015 onwards
    years_range_gf = range(2015, LAST_YEAR_WITH_SMHI_DATA+1)
    df["budgetShare"] = df[years_range_gf].sum(axis=1) / df[years_range_gf].sum(axis=0).sum()

    # Each municipality gets its share of the budget
    df['Budget'] = BUDGET*df['budgetShare']

    # Get years passed since the year the budget starts "eating"
    all_years_since_budget = list(range(BUDGET_YEAR, CURRENT_YEAR))

    # Separate years with recorded data from years with approximated data
    recorded_years_since_budget = [x for x in all_years_since_budget if x <= LAST_YEAR_WITH_SMHI_DATA]
    approximated_years_since_budget = [x for x in all_years_since_budget if x > LAST_YEAR_WITH_SMHI_DATA]

    # Subtract emissions from budget for years that have passed since the budget started "eating"
    # For recorded values, subtract values as is
    for i in range(len(recorded_years_since_budget)):
        df['Budget'] = df['Budget'] - df[recorded_years_since_budget[i]]
    # For approximated values, subtract total emission from approximated years since budget
    temp = []
    if len(approximated_years_since_budget) > 0:
        for i in range(len(df)):
            # Get index in approximated historical series for the year from which emissions need to be subtracted
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

    # Year from which the budget applies
    # (after correction with respect to years passed since budget start)
    first_year = max(BUDGET_YEAR, CURRENT_YEAR)

    temp = []
    for i in range(len(df)):
        # We'll store the exponential path for each municipality in a dictionary
        # where the keys are the years
        dicts = {}
        # Years range will be set to from when the budget applies until 2050
        years_range = range(first_year, 2050+1)

        for year in years_range:
            # Calculate what the emission level has to be at future year
            # if one were to follow the exponential decay curve
            # If data has been recorded for the year the budget kicks in, use recorded values
            if first_year <= LAST_YEAR_WITH_SMHI_DATA:
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


def calculate_historical_change_percent(df):
    # Calculate the historical average emission level change based on SMHI data from 2015 onwards

    temp = []
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # Get the years we will use for the average
        years = np.arange(2015, LAST_YEAR_WITH_SMHI_DATA+1)
        # Get the emissions from the years specified in the line above
        emissions = np.array(df.iloc[i][years], dtype=float)
        # Calculate diff (in percent) between each succesive year
        diffs_in_percent = [
            (x - emissions[i - 1])/emissions[i - 1] for i, x in enumerate(emissions)
            ][1:]
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
    # Calculate the date and year for when each municipality hits net zero emissions (if so)
    # This is done by deriving where the linear trend line crosses the time axis.

    temp = []  # temporary list that we will append to
    for i in range(len(df)):
        last_year = LAST_YEAR_WITH_SMHI_DATA  # last year with recorded data
        # Get trend line coefficients
        fit = df.iloc[i]['trendCoefficients']

        if fit[0] < 0:  # If the slope is negative we will reach the x-axis
            temp_f = -fit[1]/fit[0]  # Find where the line cross the x-axis
            # Initiate the first day of our starting point date.
            # Start at last_year+1 since the line can go up between last_year and last_year+1
            my_date = datetime.datetime(int(last_year+1), 1, 1, 0, 0, 0)
            # Add the length between the starting date and the net zero date
            # to the starting date to get the date when net zero is reached
            temp.append(
                (my_date + relativedelta(seconds=int((temp_f-int(last_year+1)) * YEAR_SECONDS)))
                .date())

        else:  # If the slope is not negative you will never reach net zero
            temp.append('Aldrig')

    df['hitNetZero'] = temp
    return df


def calculate_budget_runs_out(df):
    # Calculate the year and date for when the CO2 budget runs out for each municipality (if so)
    # This is done by integrating the trend line over the time it takes for the budget to be
    # consumed and see where we are at the time axis by that point.

    # Year from which the budget applies
    # (after correction with respect to years passed since budget start)
    budget_start_year = max(BUDGET_YEAR, CURRENT_YEAR)

    temp = []  # temporary list that we will append to
    for i in range(len(df)):
        # Get index in trend series for budget_start_year
        trend_years = list(df.iloc[i]['trend'].keys())
        budget_start_year_idx = trend_years.index(budget_start_year)
        # Get trend values for from budget_start_year onwards
        y_trend = list(df.iloc[i]['trend'].values())[budget_start_year_idx:]
        x_trend = list(df.iloc[i]['trend'].keys())[budget_start_year_idx:]

        # Get the cumulative emissions from the trend line,
        # starting from the year the corrected budget applies (from budget_start_year onwards)
        cumulative_emissions = np.trapz(y_trend, x_trend)

        # If the trends cumulative emission is larger than the budget,
        # the municipality will run out of budget
        if cumulative_emissions > df.iloc[i]['Budget']:
            # Get the line coefficients for the trend line
            fit = df.iloc[i]['trendCoefficients']

            # Remove the "anomaly" from the budget (if any)
            # Subtract emission from trend between budget_start_year and budget_start_year+1
            # since the line can go up between budget_start_year and budget_start_year+1
            # if BUDGET_YEAR == LAST_YEAR_WITH_SMHI_DATA
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

    df_cem = deduct_cement(df_smhi)

    # FIXME also calculate trend coefficients for the sectors
    df_trend_coefficients = calculate_trend_coefficients(df_cem, LAST_YEAR_WITH_SMHI_DATA)
    # FIXME also calculate approximated values for the sectors
    df_approxmimated_historical_total = calculate_approximated_historical(df_trend_coefficients, LAST_YEAR_WITH_SMHI_DATA, CURRENT_YEAR)
    df_trend = calculate_trend(df_approxmimated_historical_total, LAST_YEAR_WITH_SMHI_DATA, CURRENT_YEAR)

    df_budgeted = calculate_municipality_budgets(df_trend)
    df_paris = calculate_paris_path(df_budgeted)

    df_historical_change_percent = calculate_historical_change_percent(df_paris)
    df_needed_change_percent = calculate_needed_change_percent(df_historical_change_percent)

    df_net_zero = calculate_hit_net_zero(df_needed_change_percent)
    df_budget_runs_out = calculate_budget_runs_out(df_net_zero)

    return df_budget_runs_out
