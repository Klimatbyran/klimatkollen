import ast
from datetime import datetime
import numpy as np
import pytest as pt

def prep_date_str_for_compare(date_str):
    if date_str != 'Aldrig':
        # Format date string to date on format YYYY-mm-dd
        date_str = datetime.strftime(date_str, "%Y-%m-%d")
    
    return date_str

def str_to_dict(dict):
    # If dict is a string represetation, convert to dict
    if isinstance(dict, str):
        dict = ast.literal_eval(dict)
        
    return dict

def str_to_numpy_array(array):
    # Convert string representation of numpy array to to numpy array
    array = np.fromstring(array[1:-1], dtype=np.float64, sep=' ')
    
    return array

def prep_dict_for_compare(dict):
    # Convert str to dict, if needed
    dict = str_to_dict(dict)
    
    # If dict values are floats, add acceptible relative tolerance of 1e-8
    # See pytest.approx: https://docs.pytest.org/en/7.1.x/reference/reference.html#pytest-approx
    if any([isinstance(v, (float, np.floating)) for v in dict.values()]):
        dict = {i:pt.approx(x, rel=1e-8) for i, x in dict.items()}
        
    return dict
    