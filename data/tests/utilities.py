import ast
from datetime import datetime
import numpy as np
import pytest as pt
import pandas as pd

def get_df_from_excel(path_to_df):
    # Read df from excel
    df = pd.DataFrame(pd.read_excel(path_to_df))
    
    # Checks columns which need to be parsed from string represetations
    if 'trend' in df.columns:
        df['trend']  = [str_to_literal_structure(dict) for dict in df['trend']]
    if 'trendCoefficients' in df.columns:
        df['trendCoefficients'] = [str_to_numpy_array(array) for array in df['trendCoefficients']] 
    if 'parisPath' in df.columns:
        df['parisPath']  = [str_to_literal_structure(dict) for dict in df['parisPath']]
        
    return df

def str_to_literal_structure(param):
    # If string represetation, convert to literal structure
    if isinstance(param, str):
        param = ast.literal_eval(param)
        
    return param

def str_to_numpy_array(array):
    # Convert string representation of numpy array to to numpy array
    if isinstance(array, str):
        array = np.fromstring(array[1:-1], dtype=np.float64, sep=' ')
    
    return array

def prep_floats_for_compare(dict):
    # If dict values are floats, add acceptible relative tolerance of 1e-8
    # See pytest.approx: https://docs.pytest.org/en/7.1.x/reference/reference.html#pytest-approx
    if any([isinstance(v, (float, np.floating)) for v in dict.values()]):
        dict = {i:pt.approx(x, rel=1e-8) for i, x in dict.items()}
        
    return dict

def prep_date_str_for_compare(date_str):
    if date_str != 'Aldrig':
        # Format date string to date on format YYYY-mm-dd
        date_str = datetime.strftime(date_str, "%Y-%m-%d")
    
    return date_str
    