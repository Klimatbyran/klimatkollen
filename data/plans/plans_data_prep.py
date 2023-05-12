# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd
import re

PATH_PLANS_DATA = 'plans/klimatplaner.xlsx'

MUNICIPALITIES_W_S = ['Alingsås kommun', 'Bengtsfors kommun', 'Bollnäs kommun', 'Borås stad', 'Degerfors kommun', 'Grums kommun',
                      'Hagfors kommun', 'Hofors kommun', 'Hällefors kommun', 'Höganäs kommun', 'Kramfors kommun', 'Munkfors kommun',
                      'Mönsterås kommun', 'Robertsfors kommun', 'Sotenäs kommun', 'Storfors kommun', 'Strängnäs kommun', 'Torsås kommun',
                      'Tranås kommun', 'Vännäs kommun', 'Västerås stad']


def clean_kommun(kommun):
    # Remove any whitespace
    kommun = kommun.strip()

    # Replace 'Falu kommun' with 'Falun'
    if kommun == 'Falu kommun':
        return 'Falun'

    if kommun == 'Region Gotland (kommun)':
        return 'Gotland'

    # Remove 'kommun' or 'stad' from municipalities in the list 'municipalities_w_s'
    if kommun in MUNICIPALITIES_W_S:
        kommun = re.sub(r'( kommun| stad)', '', kommun)

    # Remove 'kommun', 'stad', 's kommun', or 's stad' from all other municipalities
    kommun = re.sub(r'( kommun| stad|s kommun|s stad)', '', kommun)

    return kommun


def get_climate_plans(df):
    # LOAD CLIMATE PLANS

    df_plans = pd.read_excel(PATH_PLANS_DATA)

    # name columns after row 1
    df_plans.columns = df_plans.iloc[0]
    df_plans = df_plans.drop(0)  # drop usless rows
    df_plans = df_plans.reset_index(drop=True)

    df_plans['Kommun'] = df_plans['Kommun'].apply(clean_kommun)

    df_plans = df_plans.rename(
        columns={df_plans.columns[6]: 'cred'})

    df_plans = df_plans.where(pd.notnull(df_plans), 'Saknas')

    df = df.merge(df_plans, on='Kommun', how='left')

    return df
