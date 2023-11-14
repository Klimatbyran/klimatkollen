# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

# data on sold cars by trafa
PATH_TRAFA_DATA = 'solutions/cars/sources/kpi1_trafa.xlsx'
# calculations based on trafa data
PATH_CARS_DATA = 'solutions/cars/sources/kpi1_calculations.xlsx'
PATH_CHARGING_POINT = 'solutions/cars/sources/charging_points_powercircle.csv'
PATH_POPULATION = 'solutions/cars/sources/population_scb.xlsx'


def get_plugin_cars():
    # LOAD AND PREP DATA FROM TRAFA ON SHARE OF ELECTIC OR HYBRID CARS IN SALES

    df_trafa = pd.read_excel(
        PATH_TRAFA_DATA, sheet_name='Tabell 5 Personbil')

    df_trafa.columns = df_trafa.iloc[3]  # name columns after row 4
    df_trafa = df_trafa.drop([0, 1, 2, 3, 4, 5])  # drop usless rows
    df_trafa = df_trafa.reset_index(drop=True)

    # Clean data in columns
    df_trafa['Kommun'] = df_trafa['Municipality'].str.strip()
    df_trafa = df_trafa.drop(
        df_trafa[df_trafa['Kommun'] == 'Okänd Kommun   '].index)
    df_trafa = df_trafa.dropna(subset=['Kommun'])
    df_trafa['electricity'] = df_trafa['Electricity'].replace(' –', 0)
    df_trafa['plugIn'] = df_trafa['Plug-in '].replace(' –', 0)

    # special solution for Upplands-Väsby
    df_trafa.loc[df_trafa['Kommun'] ==
                 'Upplands-Väsby', 'Kommun'] = 'Upplands Väsby'

    return df_trafa


def car_calculations(df):
    df_plugin_cars = get_plugin_cars()

    df_plugin_cars['electricCars'] = (
        (df_plugin_cars['electricity'] + df_plugin_cars['plugIn'])/df_plugin_cars['Total'])

    df_plugin_cars = df_plugin_cars.filter(['Kommun', 'electricCars'], axis=1)

    df = df.merge(df_plugin_cars, on='Kommun', how='left')

    # LOAD AND PREP DATA ON CHANGE RATE OF PERCENTAGE OF NEWLY REGISTERED RECHARGABLE CARS PER MUNICIPALITY AND YEAR

    df_raw_cars = pd.read_excel(PATH_CARS_DATA)

    df_raw_cars.columns = df_raw_cars.iloc[1]  # name columns after row
    df_raw_cars = df_raw_cars.drop([0, 1])  # drop usless rows
    df_raw_cars = df_raw_cars.reset_index(drop=True)

    df_raw_cars['electricCarChangePercent'] = df_raw_cars['Procentenheter förändring av andel laddbara bilar 2015-2022']
    df_raw_cars['electricCarChangeYearly'] = df_raw_cars.apply(
        lambda x: {2015: x.loc[2015], 2016: x.loc[2016], 2017: x.loc[2017], 2018: x.loc[2018], 2019: x.loc[2019], 2020: x.loc[2020], 2021: x.loc[2021], 2022: x.loc[2022]}, axis=1)

    df_cars = df_raw_cars.filter(
        ['Kommun', 'electricCarChangePercent', 'electricCarChangeYearly'], axis=1)

    df = df.merge(df_cars, on='Kommun', how='left')

    return df


def get_population_data():
    # Use if population data is needed again at a later stage
    # Load population data, set correct column headers and drop unwanted rows
    df_population = pd.read_excel(PATH_POPULATION)
    df_population.columns = df_population.iloc[4]
    df_population = df_population[5:]
    df_population.reset_index(drop=True, inplace=True)  # reset index

    # Keep only the columns with years between 2013 and 2022 to harmonize with PowerCircle data
    df_population_filtered = df_population[[
        'Kommun'] + [year for year in year_range]]
    df_population_filtered.columns = [int(col) if isinstance(
        col, float) else col for col in df_population_filtered.columns]

    return df_population_filtered


def convert_column_name_to_float(df, year_range):
    for year in year_range:
        df.rename(columns={f'{year}': float(year)}, inplace=True)
    return df


def convert_column_to_float(df, year_range):
    for year in year_range:
        df[year] = df[year].astype(float)
    return df


def charging_point_calculations():
    year_range = range(2015, 2023)

    # Load charging point data, filter for december and set correct column headers
    df_charging_raw = pd.read_csv(PATH_CHARGING_POINT)
    df_charging_filtered = df_charging_raw[df_charging_raw['år-månad'].str.endswith(
        '-12')].reset_index(drop=True)
    df_charging_filtered.rename(columns={'år-månad': 'year'}, inplace=True)
    df_charging_filtered['year'] = df_charging_filtered['year'].str[:-3]
    df_charging_melted = pd.melt(df_charging_filtered, id_vars=[
                                'year'], var_name='Kommun', value_name='Value')
    df_charging_pivoted = df_charging_melted.pivot(
        index='Kommun', columns='year', values='Value').reset_index()
    df_charging_pivoted['Kommun'] = df_charging_pivoted['Kommun'].str.title()
    df_charging_renamed = convert_column_name_to_float(df_charging_pivoted, year_range)
    df_charging_float = convert_column_to_float(df_charging_renamed, year_range)

    # Remove duplicate occurrences of Pajala
    df_charging_duplicates_removed = df_charging_float.drop(index=172, inplace=True)

    df_result = pd.DataFrame()
    df_result['Kommun'] = df_charging_float['Kommun']
    df_result = df_result.drop(index=range(290, len(df_result)))
    for year in year_range:
        df_result[year] = df_charging_pivoted[year]

    df_plugin_cars = get_plugin_cars()
    df_plugin_cars['electricCars'] = df_plugin_cars['electricity'] + df_plugin_cars['plugIn']
    df_plugin_cars = df_plugin_cars.filter(['Kommun', 'electricCars'], axis=1)

    df_result = df_result.merge(df_plugin_cars, on='Kommun', how='left')

    print(df_result.head(10))   
    df_result['CPEV'] = df_result[2022] / df_result['electricCars']

    df_result_filtered = df_result.filter(
        ['Kommun', 'CPEV'], axis=1)
    
    # df_result_filtered['ChargingPointsYearlyAverage'] = df_result_filtered['ChargingPointsPerYear'].apply(
    #     # fixme fortsätt här
    #     lambda x: (x[6] - x[0]) / len(x) if len(x) > 0 else 0
    # )

    print(df_result_filtered.head(10))

    df_result_filtered.to_excel('output/cpev.xlsx')
    smallest = df_result_filtered['CPEV'].min()
    largest = df_result_filtered['CPEV'].max()
    mean = df_result_filtered['CPEV'].mean()
    
    # df = df.merge(df_result_filtered, on='Kommun', how='left')

    # return df

charging_point_calculations()