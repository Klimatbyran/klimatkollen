# -*- coding: utf-8 -*-

import pandas as pd


PATH_PROCUREMENTS = 'facts/procurements/Klimatkrav offentlig upphandling kartläggning.xlsx'

def get_procurement_data():
    """
    Retrieves climate requirements in procurement data.
    """

    df = pd.read_excel(PATH_PROCUREMENTS)
    df['procurementScore'] = df['Sammanstält svar:']
    return df.filter(['Kommun', 'procurementScore'])
