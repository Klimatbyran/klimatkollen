# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd
from scipy.optimize import linprog


PATH_POWERCIRCLE_CPEV = "solutions/cars/sources/powercircle_municipality_data_dec_2023.csv"


def get_cpev():
    """
    This function loads data from a CSV file provided by PowerCircle and extracts a DataFrame with the municipality names 
    in title case and their corresponding CPEV (charge points per electric vehicle) values for December 2023.

    Returns:
        df_cpev (DataFrame): A pandas DataFrame with two columns, 'Kommun' (in title case) and 'CPEV', containing the municipality
                             names and their corresponding CPEV values.
    """

    # Load CPEV data from PowerCircle
    df_cpev_raw = pd.read_csv(PATH_POWERCIRCLE_CPEV)
    
    # Rename the unnamed column to "Kommun" and convert 'Kommun' to title case
    df_cpev_raw = df_cpev_raw.rename(columns={"Unnamed: 0": "Kommun"})
    df_cpev_raw['Kommun'] = df_cpev_raw['Kommun'].str.title()
    
    # Extract the 'Kommun' and 'CPEV' columns
    df_cpev = df_cpev_raw[['Kommun', 'CPEV']]

    return df_cpev
