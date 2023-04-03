# -*- coding: utf-8 -*-

import json
import numpy as np
import pandas as pd

path_political_rule = 'politicalRule2022.xlsx'
df_raw = pd.read_excel(path_political_rule)

print(df_raw.head())  # fixme fortsätt här