# -*- coding: utf-8 -*-

import pandas as pd
from helpers import clean_kommun


PATH_NUR_DATA = 'facts/procurements/NUE2022_DATA_2023-12-20.xlsx'
PATH_GREENPEACE_DATA = 'facts/procurements/Klimatkrav offentlig upphandling kartläggning.xlsx'

def get_procurement_data():
    """
    Retrieves climate requirements in procurement data.
    """

    # Read Greenpeace data
    df_greenpeace = pd.read_excel(PATH_GREENPEACE_DATA)
    df_greenpeace['hasLink'] = df_greenpeace['Länk\nKlimat\nkrav']
    df_greenpeace['hasLink'] = df_greenpeace['hasLink'].apply(lambda x: 1 if pd.notnull(x) else 0)
    df_greenpeace_filter = df_greenpeace[['Kommun', 'hasLink']]

    # Read NUR data
    df_NUR = pd.read_excel(PATH_NUR_DATA)
    df_NUR['Kommun'] = df_NUR['ORG_NAMN'].apply(clean_kommun)
    df_NUR_filter = df_NUR[['Kommun', 'BINÄRT_UTFALL']].fillna(0)

    # Merge the two dataframes
    df_merged = pd.merge(df_greenpeace_filter, df_NUR_filter, on='Kommun', how='left')

    # Calculate procurement score
    df_merged['procurementScore'] = df_merged.apply(lambda row: 2 if row['BINÄRT_UTFALL'] > 0 else row['hasLink'], axis=1)

    return df_merged
