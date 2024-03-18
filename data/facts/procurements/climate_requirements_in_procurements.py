# -*- coding: utf-8 -*-

import pandas as pd
from helpers import clean_kommun


PATH_NUR_DATA = 'facts/procurements/NUE2022_DATA_2023-12-20.xlsx'
PATH_GREENPEACE_DATA = 'facts/procurements/Klimatkrav offentlig upphandling kartläggning.xlsx'

def get_greenpeace_data():
    df_greenpeace = pd.read_excel(PATH_GREENPEACE_DATA)
    df_greenpeace['hasLink'] = df_greenpeace['Länk\nKlimat\nkrav']
    df_greenpeace['hasLink'] = df_greenpeace['hasLink'].apply(lambda x: 1 if pd.notnull(x) else 0)
    return df_greenpeace[['Kommun', 'hasLink']]

def get_nur_data():
    df_nur = pd.read_excel(PATH_NUR_DATA)
    df_nur['Kommun'] = df_nur['ORG_NAMN'].apply(clean_kommun)
    return df_nur[['Kommun', 'BINÄRT_UTFALL']]

def calculate_procurement_score(df_greenpeace, df_nur):
    df_merge = pd.merge(df_greenpeace, df_nur, on='Kommun', how='left')
    df_merge['procurementScore'] = df_merge.apply(
        lambda row: 2 if row['hasLink'] > 0 else 1 if row['BINÄRT_UTFALL'] > 0 else 0, axis=1
        )
    df_fill = df_merge.fillna(0) 
    return df_fill[['Kommun', 'procurementScore']]

def get_procurement_data():
    """
    Retrieves climate requirements in procurement data.
    """

    # Read and clean Greenpeace data
    df_greenpeace = get_greenpeace_data()

    # Read and clean NUR data
    df_nur = get_nur_data()

    # Return df with calculated procurement scores
    return calculate_procurement_score(df_greenpeace, df_nur)
