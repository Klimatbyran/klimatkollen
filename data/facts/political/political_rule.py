# -*- coding: utf-8 -*-

import json
import numpy as np
import pandas as pd


path_political_rule = 'politicalRule2022.xlsx'

df = pd.read_excel(path_political_rule)

df['Kommun'] = df['Unnamed: 1']
df.loc[df['Kommun'] == 'Falu kommun', 'Kommun'] = 'Falun kommun'
df.loc[df['Kommun'] == 'Region Gotland (kommun)', 'Kommun'] = 'Gotland kommun'
df['Other'] = df['Annat parti, ange vilket eller vilka']
df = df.filter(['Kommun', 'SD 2022', 'M 2022', 'KD 2022', 'L 2022',
               'C 2022', 'MP 2022', 'S 2022', 'V 2022', 'ÖP 2022', 'Other'])

RawPoliticalRule = []
for i, row in df.iterrows():
    kommun = row['Kommun']
    styre = ','.join([str(row[col]) if not pd.isna(row[col])
                     else '' for col in df.columns[1:-1]])
    other = row['Other'] if not pd.isna(row['Other']) else ''
    RawPoliticalRule.append({'kommun': kommun, 'styre': styre, 'other': other})

with open('raw-political-rule.json', 'w') as f:
    json.dump(RawPoliticalRule, f)
