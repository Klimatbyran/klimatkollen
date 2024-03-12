# -*- coding: utf-8 -*-

import pandas as pd
from helpers import clean_kommun


PATH_NUR_DATA = 'facts/procurements/NUE2022_DATA_DANIELZ_2023-12-20.xlsx'
PATH_GREENPEACE_DATA = 'facts/procurements/Klimatkrav offentlig upphandling kartläggning.xlsx'

def get_procurement_data():
    """
    Retrieves climate requirements in procurement data.
    """

    df_greenpeace = pd.read_excel(PATH_GREENPEACE_DATA)
    df_greenpeace['link'] =  df_greenpeace['Länk\nKlimat\nkrav']
    df_greenpeace['link'] = df_greenpeace['link'].apply(
        lambda x: 1 if pd.notnull(x) else 0
        )
    df_greenpeace_filter = df_greenpeace.filter(['Kommun', 'link'])

    df_NUR = pd.read_excel(PATH_NUR_DATA)
    df_NUR['Kommun'] = df_NUR['ORG_NAMN'].apply(clean_kommun)
    df_NUR_filter = df_NUR.filter(['Kommun', 'BINÄRT_UTFALL'])

    df_merged = df_greenpeace_filter.merge(df_NUR_filter, on='Kommun', how='left')
    df_merged['BINÄRT_UTFALL'] = df_merged['BINÄRT_UTFALL'].fillna(0)
    df_merged['procurementScore'] = df_merged['link'] + df_merged['BINÄRT_UTFALL']

    return df_merged
