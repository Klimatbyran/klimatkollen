# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

# data on sold cars by trafa
trafa_paths = {
    2015: 'solutions/cars/sources/fordon_lan_och_kommuner_2015.xlsx',
    2016: 'solutions/cars/sources/fordon_lan_och_kommuner_2016.xlsx',
    2017: 'solutions/cars/sources/fordon_lan_och_kommuner_2017_rev.xlsx',
    2018: 'solutions/cars/sources/fordon_lan_och_kommuner_2018.xlsx',
    2019: 'solutions/cars/sources/fordon_lan_och_kommuner_2019.xlsx',
    2020: 'solutions/cars/sources/fordon_lan_och_kommuner_2020.xlsx',
    2021: 'solutions/cars/sources/fordon_lan_och_kommuner_2021.xlsx',
    2022: 'solutions/cars/sources/fordon_lan_och_kommuner_2022.xlsx',
}

# calculations based on trafa data
PATH_CARS_DATA = 'solutions/cars/sources/kpi1_calculations.xlsx'
PATH_CHARGING_POINT = 'solutions/cars/sources/charging_points_powercircle.csv'
PATH_POPULATION = 'solutions/cars/sources/population_scb.xlsx'


def set_dataframe_columns(df, header_row):
    df.columns = df.iloc[header_row]
    return df.drop(range(header_row + 4))


def clean_municipality_data(df):
    df['Kommun'] = df['Kommun'].str.strip()
    df = df.drop(df[df['Kommun'].isin(['Okänd Kommun   ', 'OKÄND KOMMUN', 'OKÄND KOMMUN1)'])].index)
    return df.dropna(subset=['Kommun'])


def process_common_data(df, year):
    df['electricity'] = df['El'].replace([' –', '–'], 0).astype(float)
    df['plugIn'] = df['Laddhybrider'].replace([' –', '–'], 0).astype(float)
    df[year] = df['electricity'] + df['plugIn']
    return df.filter(['Kommun', year], axis=1)


def load_and_process_trafa_data(path, year):
    # Define sheet names and header rows for each year
    sheet_details = {
        '2015': ('RSK-Tabell 3 2015', 4),
        '2016': ('Tabell 3', 4),
        '2018': ('Tabell 4', 4),
        '2021': ('Tabell 4', 2),
        '2022': ('Tabell 4 Personbil', 2),
    }

    # Default sheet details
    default_sheet, default_header = ('Tabell 4', 4)

    # Choose the sheet name and header row based on the year (2017 and 2019-2020 are default)
    sheet_name, header_row = sheet_details.get(str(year), (default_sheet, default_header))

    # Load data
    df = pd.read_excel(path, sheet_name=sheet_name)

    # Set columns and drop initial rows
    df = set_dataframe_columns(df, header_row)

    # Clean municipality data
    df = clean_municipality_data(df)

    # Process common data and return
    return process_common_data(df, year)


def get_electric_car_change(df):
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


def load_charging_point_data():
    df_charging_raw = pd.read_csv(PATH_CHARGING_POINT)
    df_charging_filtered = df_charging_raw[df_charging_raw['år-månad'].str.endswith('-12')].reset_index(drop=True)
    df_charging_filtered.rename(columns={'år-månad': 'year'}, inplace=True)
    df_charging_filtered['year'] = df_charging_filtered['year'].str[:-3]
    return df_charging_filtered


def pivot_charging_data(df_charging_filtered):
    df_charging_melted = pd.melt(df_charging_filtered, id_vars=['year'], var_name='Kommun', value_name='Value')
    df_charging_pivoted = df_charging_melted.pivot(index='Kommun', columns='year', values='Value').reset_index()
    df_charging_pivoted['Kommun'] = df_charging_pivoted['Kommun'].str.title()
    return df_charging_pivoted


def convert_column_to_float(df, year_range):
    for year in year_range:
        df.rename(columns={f'{year}': float(year)}, inplace=True)
    return df


def calculate_average_yearly_change(df, year_range):    
    # Calculate yearly changes for each municipality
    df_yearly_changes = df[year_range].diff(axis=1)     
    # Using 'iloc[:, 1:]' to exclude the first year, 2015, as it will have NaN values after diff()
    df['cpevChangeAverage'] = (df_yearly_changes.iloc[:, 1:].mean(axis=1)*100).round(2)

    print(df[df['Kommun'] == 'Sorsele'])
    print(df_yearly_changes.iloc[196])

    return df


def charging_point_calculations():
    year_range = range(2015, 2023)
    df_result = pd.DataFrame()


    # Load and process charging point data
    df_charging_filtered = load_charging_point_data()
    df_charging_pivoted = pivot_charging_data(df_charging_filtered)

    df_result['Kommun'] = df_charging_pivoted['Kommun'] # Assign Kommun column to result df
    df_result = df_result.drop(index=range(290, len(df_result)))
    df_charging_float = convert_column_to_float(df_charging_pivoted, year_range)

    # Load and process Trafa data for each year
    for year, path in trafa_paths.items():
        df_year = load_and_process_trafa_data(path, year)
        df_result = df_result.merge(df_year, on='Kommun', how='left')

    df_result = df_result.merge(df_charging_float, on='Kommun', how='left')

    for year in year_range:
        c = df_result[f'{year}.0_y']
        ev = df_result[f'{year}_x']
        df_result[year] = c/ev
        
    df_result = calculate_average_yearly_change(df_result, year_range)
    df_result = df_result.filter(['Kommun', 'cpevChangeAverage'], axis=1)
    df_result.to_excel('output/cpev.xlsx')

    smallest = df_result['cpevChangeAverage'].min()
    largest = df_result['cpevChangeAverage'].max()
    mean = df_result['cpevChangeAverage'].mean()
    print(smallest, largest, mean) 
    
    # # df = df.merge(df_result_filtered, on='Kommun', how='left')

    # # return df

charging_point_calculations()