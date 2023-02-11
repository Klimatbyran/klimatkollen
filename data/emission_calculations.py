import datetime
import json
import numpy as np
import pandas as pd

# Budget i ton från och med 2020
budget = 170000000  # +40948459*50.81/46.29+40948459*50.81/46.29*1.05

# LOAD AND PREPARE DATA FROM SMHI

# Download data from SMHI and load it in to a pandas dataframe
path_smhi = 'https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2'
df_raw = pd.read_excel(path_smhi)
df = df_raw  # so that I dont have to re-download the data

df = df.drop([0, 1, 2])  # remove the first 4 rows
df = df.reset_index(drop=True)  # reset index

# Put the first 4 elements in row 1 in to row 0
df.iloc[0, [0, 1, 2, 3]] = df.iloc[1, [0, 1, 2, 3]]

df = df.drop([1])  # remove row 1
df = df.reset_index(drop=True)  # reset index
# change the coloum names to the first rows entries
df = df.rename(columns=df.iloc[0])
df = df.drop([0])  # remove row 0

df = df[(df['Huvudsektor'] == 'Alla') & (df['Undersektor'] == 'Alla')
        & (df['Län'] != 'Alla') & (df['Kommun'] != 'Alla')]
df = df.reset_index(drop=True)

# Remove said columns
df = df.drop(columns=['Huvudsektor', 'Undersektor', 'Län'])
df = df.sort_values(by=['Kommun'])  # sort by Kommun
df = df.reset_index(drop=True)

# https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=1441 Sources for cement deduction
# https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=5932
# https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=834

cement_deduction = {'Mörbylånga':
                    {2010: 248025000/1000, 2015: 255970000/1000, 2016: 239538000/1000,
                        2017: 255783000/1000, 2018: 241897000/1000, 2019: 65176000/1000, 2020: 0},
                    'Skövde':
                    {2010: 356965000/1000, 2015: 358634000/1000, 2016: 384926000/1000, 2017: 407633130 /
                        1000, 2018: 445630340/1000, 2019: 440504330/1000, 2020: 459092473/1000},
                    'Gotland':
                    {2010: 1579811000/1000, 2015: 1926036000/1000, 2016: 1903887000/1000, 2017: 1757110000 /
                     1000, 2018: 1740412000/1000, 2019: 1536480000/1000, 2020: 1624463000/1000}
                    }

df_cem = df.copy()  # copy dataframe

# Deduct cement from given kommuns
for i in cement_deduction.keys():
    for j in cement_deduction[i].keys():
        df_cem.loc[df_cem['Kommun'] == i, j] = df_cem.loc[df_cem['Kommun']
                                                          == i, j].values - cement_deduction[i][j]

# Calculate each kommuns procentage of the total budget using grandfathering
year_range = [2015, 2016, 2017, 2018, 2019]
df_cem['Andel'] = [df_cem[year_range].sum(axis=1)[i]/df_cem[year_range].sum(
    axis=0).sum() for i in range(len(df_cem))]

# Update each kommuns budget given the new 2020 data
df_cem['Budget'] = (budget)*df_cem['Andel']-df_cem[2020]

# Create an exponential curve that satisfy each kommuns budget
temp = []
for i in range(len(df_cem)):
    dicts = {}
    keys = range(2020, 2050+1)
    for idx, value in enumerate(keys):
        dicts[value] = df_cem.iloc[i][2020] * \
            np.exp(-(df_cem.iloc[i][2020])/(df_cem.iloc[i]['Budget'])*idx)
    temp.append(dicts)

df_cem['Paris Path'] = temp  # add the exponential path to the dataframe

# Calculate the linerar trend
temp = []
for i in range(len(df_cem)):
    dicts = {2020: df_cem.iloc[i][2020]}
    x = np.arange(2015, 2020+1)
    y = np.array(df_cem.iloc[i][5:10+1], dtype=float)
    fit = np.polyfit(x, y, 1)

    keys = range(2021, 2050+1)
    for idx, value in enumerate(keys):
        dicts[value] = max(0, fit[0]*value+fit[1])
    temp.append(dicts)

df_cem['Linear Path'] = temp  # add the linear trend to the dataframe

# Calculate the emission from the linear trend using the trapezoidal rule
temp = []
for i in range(len(df_cem)):
    temp.append(np.trapz(list(df_cem.iloc[i]['Linear Path'].values()), list(
        df_cem.iloc[i]['Linear Path'].keys())))

# Add the emission form the linear trend to the dataframe
df_cem['Linear Emission'] = temp


# LOAD CRUNCHED DATA FROM CLIMATE VIEW
# fix while rest of calculations are missing

path_crunched_data = 'output_extra.xlsx'
df_raw_crunched = pd.read_excel(path_crunched_data)
df_raw_crunched['netZeroReached'] = [i.date() if type(i) is datetime.datetime else i for i in df_raw_crunched['När netto noll nås']]
df_raw_crunched['budgetRunsOut'] = [i.date() if type(i) is datetime.datetime else i for i in df_raw_crunched['Budget tar slut']]
df_crunched = df_raw_crunched.filter(
    ['Kommun', 'netZeroReached', 'budgetRunsOut'], axis=1)

df_master = df_cem .merge(df_crunched, on='Kommun', how='left')

temp = []  # remane the columns
for i in range(len(df_cem)):
    temp.append({
        'kommun': df_master.iloc[i]['Kommun'],
        'emissions': {
            '1990': df_master.iloc[i][1990],
            '2000': df_master.iloc[i][2000],
            '2005': df_master.iloc[i][2005],
            '2010': df_master.iloc[i][2010],
            '2015': df_master.iloc[i][2015],
            '2016': df_master.iloc[i][2016],
            '2017': df_master.iloc[i][2017],
            '2018': df_master.iloc[i][2018],
            '2019': df_master.iloc[i][2019],
            '2020': df_master.iloc[i][2020]
        },
        'budget': df_master.iloc[i]['Budget'],
        'emissionBudget': df_master.iloc[i]['Paris Path'],
        'trend': df_master.iloc[i]['Linear Path'],
        'futureEmission': df_master.iloc[i]['Linear Emission'],
        'netZeroReached': df_master.iloc[i]['netZeroReached'],
        'budgetRunsOut': df_master.iloc[i]['budgetRunsOut']
    })

with open('emission-data.json', 'w', encoding='utf8') as json_file:  # save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False, default=str)
