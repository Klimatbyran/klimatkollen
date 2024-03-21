# -*- coding: utf-8 -*-

import os
import pandas as pd
from helpers import clean_kommun


PATH_GREENPEACE_DATA = 'facts/procurements/Klimatkrav offentlig upphandling kartläggning.xlsx'

RELATIVE_PATH_NUR_DATA = os.path.join(
    os.path.dirname(__file__),
    "../../../public/data/procurements/NUE2022_DATA_2023-12-20.xlsx"
)
NORMALIZED_PATH_NUR_DATA = os.path.normpath(RELATIVE_PATH_NUR_DATA)

def get_greenpeace_data():
    df_greenpeace = pd.read_excel(PATH_GREENPEACE_DATA)
    df_greenpeace['procurementLink'] = df_greenpeace['Länk\nKlimat\nkrav']
    df_greenpeace['procurementLink'] = df_greenpeace['procurementLink'].fillna('')
    return df_greenpeace[['Kommun', 'procurementLink']]

def get_nur_data():
    df_nur = pd.read_excel(NORMALIZED_PATH_NUR_DATA)
    df_nur['Kommun'] = df_nur['ORG_NAMN'].apply(clean_kommun)
    return df_nur[['Kommun', 'BINÄRT_UTFALL']]

def calculate_procurement_score(df_greenpeace, df_nur):
    df_merge = pd.merge(df_greenpeace, df_nur, on='Kommun', how='left')
    df_merge['procurementScore'] = df_merge.apply(
        lambda row: 2 if row['procurementLink'] != '' else 1 if row['BINÄRT_UTFALL'] > 0 else 0, axis=1
        )
    df_fill = df_merge.fillna(0) 
    return df_fill[['Kommun', 'procurementLink', 'procurementScore']]

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
