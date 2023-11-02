# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

PATH_TRAFA_DATA = 'solutions/cars/kpi1_trafa.xlsx'  # data on sold cars by trafa
# calculations based on trafa data
PATH_CARS_DATA = 'solutions/cars/kpi1_calculations.xlsx'


def car_calculations(df):
    # LOAD AND PREP DATA FROM TRAFA ON SHARE OF ELECTIC OR HYBRID CARS IN SALES

    df_raw_trafa = pd.read_excel(
        PATH_TRAFA_DATA, sheet_name='Tabell 5 Personbil')

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

    df = df.merge(df_trafa, on='Kommun', how='left')

    # LOAD AND PREP DATA ON CHANGE RATE OF PERCENTAGE OF NEWLY REGISTERED RECHARGABLE CARS PER MUNICIPALITY AND YEAR

    df_raw_cars = pd.read_excel(PATH_CARS_DATA)

    df_raw_cars.columns = df_raw_cars.iloc[1]  # name columns after row
    df_raw_cars = df_raw_cars.drop([0, 1])  # drop usless rows
    df_raw_cars = df_raw_cars.reset_index(drop=True)

    df_raw_cars['electricCarChangePercent'] = df_raw_cars['Procentenheter förändring av andel laddbara bilar 2015-2022']
    df_raw_cars['electricCarChangeYearly'] = df_raw_cars.apply(
        lambda x: {
            2015: x.loc[2015],
            2016: x.loc[2016],
            2017: x.loc[2017],
            2018: x.loc[2018],
            2019: x.loc[2019],
            2020: x.loc[2020],
            2021: x.loc[2021],
            2022: x.loc[2022]
        }, axis=1)

    df_cars = df_raw_cars.filter(
        ['Kommun', 'electricCarChangePercent', 'electricCarChangeYearly'], axis=1)

    df = df.merge(df_cars, on='Kommun', how='left')

    return df
