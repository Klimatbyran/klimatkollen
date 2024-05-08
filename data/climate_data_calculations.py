# -*- coding: utf-8 -*-

import json
from typing import Dict, List, Any
import argparse

import pandas as pd

from solutions.cars.electric_car_change_rate import get_electric_car_change_rate
from solutions.cars.electric_vehicle_per_charge_points import get_electric_vehicle_per_charge_points
from solutions.bicycles.bicycle_data_calculations import bicycle_calculations
from facts.plans.plans_data_prep import get_climate_plans
from facts.municipalities_counties import get_municipalities
from facts.procurements.climate_requirements_in_procurements import get_procurement_data
from issues.emissions.emission_data_calculations import emission_calculations
from issues.consumption.consumption_data_calculations import get_consumption_emissions

# Notebook from ClimateView that our calculations are based on:
# https://colab.research.google.com/drive/1qqMbdBTu5ulAPUe-0CRBmFuh8aNOiHEb?usp=sharing

def build_dataframe() -> pd.DataFrame:
    # Get emission calculations
    df = get_municipalities()
    print('1. Municipalities loaded and prepped')

    df = emission_calculations(df)
    print('2. Climate data and calculations added')

    df = get_electric_car_change_rate(df)
    print('3. Hybrid car data and calculations added')

    df = get_climate_plans(df)
    print('4. Climate plans added')

    df = bicycle_calculations(df)
    print('5. Bicycle data added')

    df = get_consumption_emissions(df)
    print('6. Consumption emission data added')

    df_evpc = get_electric_vehicle_per_charge_points()
    df = df.merge(df_evpc, on='Kommun', how='left')
    print('7. CPEV for December 2023 added')

    df_procurements = get_procurement_data()
    df = df.merge(df_procurements, on='Kommun', how='left')
    print('8. Climate requirements in procurements added')

    return df

def round_processing(v, num_decimals):
    '''
    Round float values to a certain number of decimals. If the argument v is a 
    dictionary, round all values in the dictionary recursively.

    Arguments: v - the value to round.
               num_decimals - the number of decimals to round to.

    Returns the rounded value.
    '''
    new_v = v
    if (isinstance(v, dict)):
        new_v = {k: round_processing(a, num_decimals) for k, a in v.items()}
    elif (isinstance(v, float)):
        new_v = round(v, num_decimals)
    return new_v
    
def create_dataentry(row: pd.Series, num_decimals: int) -> Dict[str, Any]:    
    '''
    Create a datastructure based on a pandas Series and optionally round the 
    values to a certain number of decimals.

    Arguments: row - the pandas Series of values for the data entry.
               num_decimals - the number of decimals to round to, if > 0

    Returns the data entry as a dictionary.
    '''
    entry = {
            'kommun': row['Kommun'],
            'län': row['Län'],
            'emissions': {
                '1990': row[1990],
                '2000': row[2000],
                '2005': row[2005],
                '2010': row[2010],
                '2015': row[2015],
                '2016': row[2016],
                '2017': row[2017],
                '2018': row[2018],
                '2019': row[2019],
                '2020': row[2020],
                '2021': row[2021],
            },
            'budget': row['Budget'],
            'emissionBudget': row['parisPath'],
            'approximatedHistoricalEmission': row['approximatedHistorical'],
            'totalApproximatedHistoricalEmission': row['totalApproximatedHistorical'],
            'trend': row['trend'],
            'trendEmission': row['trendEmission'],
            'historicalEmissionChangePercent': row[
                'historicalEmissionChangePercent'
            ],
            'neededEmissionChangePercent': row[
                'neededEmissionChangePercent'
            ],
            'hitNetZero': row['hitNetZero'],
            'budgetRunsOut': row['budgetRunsOut'],
            'electricCarChangePercent': row['electricCarChangePercent'],
            'electricCarChangeYearly': row['electricCarChangeYearly'],
            'climatePlanLink': row['Länk till aktuell klimatplan'],
            'climatePlanYear': row['Antagen år'],
            'climatePlanComment': row['Namn, giltighetsår, kommentar'],
            'bicycleMetrePerCapita': row['metrePerCapita'],
            'totalConsumptionEmission': row['Total emissions'],
            'electricVehiclePerChargePoints': row['EVPC'],
            'procurementScore': row['procurementScore'],
            'procurementLink': row['procurementLink'],
        }
    
    if (num_decimals > 0):
        entry = {k: round_processing(v, num_decimals) for k, v in entry.items()}

    return entry
    
def create_datastructure_from_df(df: pd.DataFrame, num_decimals: int) -> List[Dict[str, Any]]:
    '''
    Create a datastructure from a dataframe.
    Optionally round the values to a certain number of decimals. By default, do
    not round values.

    Arguments: df - the dataframe of all records
               num_decimals - the number of decimals to round to, if > 0

    Returns the datastructure as a list of dictionaries.
    '''

    data_struct = [
        create_dataentry(df.iloc[i], num_decimals)
        for i in range(len(df))
    ]
    return data_struct

def store_dataframe(df: pd.DataFrame, num_decimals: int):
    output_file = 'output/climate-data.json'

    if (num_decimals > 0):
        # Create a file with rounded values
        output_file = 'output/climate-data-rounded.json'


    with open(output_file, 'w', encoding='utf8') as json_file:
        # save dataframe as json file
        json.dump(create_datastructure_from_df(df, num_decimals=num_decimals), json_file, ensure_ascii=False, default=str)
        
    print(f"Climate data JSON file {output_file} created and saved")



if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Climate data calculations")
    parser.add_argument("-n", "--num_decimals", default=-1, type=int, help="Number of decimals to round to")
    args = parser.parse_args()

    df = build_dataframe()

    store_dataframe(df, args.num_decimals)


