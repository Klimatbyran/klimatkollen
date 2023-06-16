import numpy as np
import pandas as pd


PATH_BICYCLE_DATA = 'solutions/bicycles/cykelstatistik.xlsx'


def bicycle_calculations(df):
    df_raw_bicycles = pd.read_excel(PATH_BICYCLE_DATA)
    df_raw_bicycles['metrePerCapita'] = df_raw_bicycles['Meter per capita']
    df_bicycles = df_raw_bicycles.filter(
        ['Kommun', 'metrePerCapita'], axis=1)
    df = df.merge(df_bicycles, on='Kommun', how='left')
    return df