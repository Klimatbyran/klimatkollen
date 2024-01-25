import ast
import numpy
import pytest as pt

def prep_dict_for_compare(dict):
    
    # If type of dict is str, convert str representation of dict to dict
    if isinstance(dict, str):
        dict = ast.literal_eval(dict)
        
    # If dict values are floats, add acceptible relative tolerance of 1e-8
    # See pytest.approx: https://docs.pytest.org/en/7.1.x/reference/reference.html#pytest-approx
    if all([isinstance(v, float) for v in dict.values()]):
        dict = {i:pt.approx(x, rel=1e-8) for i, x in dict.items()}
        
    return dict
    