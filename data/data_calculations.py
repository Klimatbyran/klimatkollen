import json
import numpy as np
import pandas as pd

#Budget i ton från och med 2020
budget = 170000000#+40948459*50.81/46.29+40948459*50.81/46.29*1.05

df_raw = pd.read_excel('https://nationellaemissionsdatabasen.smhi.se/api/getexcelfile/?county=0&municipality=0&sub=CO2') #Download data from SMHI and load it in to a pandas dataframe

df = df_raw #so that I dont have to re-download the data


df = df.drop([0,1,2]) #remove the first 4 rows
df = df.reset_index(drop=True) #reset index


df.iloc[0,[0, 1, 2, 3]] = df.iloc[1,[0, 1, 2 ,3]] #put the first 4 elements in row 1 in to row 0

df = df.drop([1]) #remove row 1
df = df.reset_index(drop=True)#reset index
df = df.rename(columns=df.iloc[0]) #chnage the coloum names to the first rows entries
df = df.drop([0]) #remove row 0

df = df[(df['Huvudsektor'] == 'Alla') & (df['Undersektor'] == 'Alla') & (df['Län'] != 'Alla') & (df['Kommun'] != 'Alla')]
df = df.reset_index(drop=True)

df = df.drop(columns=['Huvudsektor', 'Undersektor', 'Län']) #remove said columns
df = df.sort_values(by=['Kommun']) #sort by Kommun
df = df.reset_index(drop=True)

#https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=1441 Sources for cement deduction
#https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=5932
#https://utslappisiffror.naturvardsverket.se/sv/Sok/Anlaggningssida/?pid=834

cement_deduction = {'Mörbylånga':{2010:248025000/1000, 2015:255970000/1000, 2016: 239538000/1000, 2017: 255783000/1000, 2018: 241897000/1000, 2019:65176000/1000, 2020: 0},
                     'Skövde':{2010:356965000/1000, 2015:358634000/1000, 2016: 384926000/1000, 2017: 407633130/1000, 2018: 445630340/1000, 2019:440504330/1000, 2020: 459092473/1000},
                     'Gotland':{2010:1579811000/1000, 2015:1926036000/1000, 2016: 1903887000/1000, 2017: 1757110000/1000, 2018: 1740412000/1000, 2019:1536480000/1000, 2020: 1624463000/1000}
                    }

df_cem = df.copy() #make a copy dataframe

for i in cement_deduction.keys(): #deduct cement from given kommuns
  for j in cement_deduction[i].keys():
      df_cem.loc[df_cem['Kommun'] == i, j] = df_cem.loc[df_cem['Kommun'] == i, j].values - cement_deduction[i][j]

df_cem['Andel'] = [df_cem[[2015, 2016, 2017, 2018, 2019]].sum(axis=1)[i]/df_cem[[2015, 2016, 2017, 2018, 2019]].sum(axis=0).sum() for i in range(len(df_cem))] #calculate each kommuns procentage of the total budget using grandfathering

df_cem['Budget'] = (budget)*df_cem['Andel']-df_cem[2020] #update each kommuns budget given the new 2020 data

temp = []
for i in range(len(df_cem)): #make a exponential cureve that satisfy each kommuns budget
  dicts = {}
  keys = range(2020,2050+1)
  for idx, value in enumerate(keys):
    dicts[value] = df_cem.iloc[i][2020]*np.exp(-(df_cem.iloc[i][2020])/(df_cem.iloc[i]['Budget'])*idx)
  temp.append(dicts)

df_cem['Paris Path'] = temp #add the exponential path to the dataframe

temp = []
for i in range(len(df_cem)): #calculate the linerar trend
  dicts = {2020:df_cem.iloc[i][2020]}
  x = np.arange(2015,2020+1)
  y = np.array(df_cem.iloc[i][5:10+1], dtype=float)
  fit = np.polyfit(x, y ,1)

  keys = range(2021,2050+1)
  for idx, value in enumerate(keys):
    dicts[value] = max(0,fit[0]*value+fit[1])
  temp.append(dicts)

df_cem['Linear Path'] = temp #add the linear trend to the dataframe

temp = []
for i in range(len(df_cem)): #calculate the emission from the linear trend using the trapezoidal rule
  temp.append(np.trapz(list(df_cem.iloc[i]['Linear Path'].values()),list(df_cem.iloc[i]['Linear Path'].keys())))

df_cem['Linear Emission'] = temp # add the emission form the linear trend to the dataframe

temp = [] #remane the columns
for i in range(len(df_cem)):
  temp.append({'kommun': df_cem.iloc[i]['Kommun'],
 'emissions':{'1990':df_cem.iloc[i][1990],'2000':df_cem.iloc[i][2000],'2005':df_cem.iloc[i][2005],'2010':df_cem.iloc[i][2010],'2015':df_cem.iloc[i][2015],'2016':df_cem.iloc[i][2016],'2017':df_cem.iloc[i][2017],'2018':df_cem.iloc[i][2018],'2019':df_cem.iloc[i][2019],'2020':df_cem.iloc[i][2020]},
 'Budget' : df_cem.iloc[i]['Budget'],
 'Exponentiell Bana': df_cem.iloc[i]['Paris Path'],
 'Linjär Bana' : df_cem.iloc[i]['Linear Path'],
 'Linjär Utsläpp' : df_cem.iloc[i]['Linear Emission']                          
                          })

with open('emission_budget_data.json', 'w', encoding='utf8') as json_file: #save dataframe as json file
    json.dump(temp, json_file, ensure_ascii=False)
