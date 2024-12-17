# -*- coding: utf-8 -*-

import argparse
import json
from typing import Any, Dict, List

import numpy as np
import pandas as pd

from solutions.cars.electric_car_change_rate import get_electric_car_change_rate
from solutions.cars.electric_vehicle_per_charge_points import get_electric_vehicle_per_charge_points
from solutions.bicycles.bicycle_data_calculations import calculate_bike_lane_per_capita
from facts.plans.plans_data_prep import get_climate_plans
from facts.municipalities_counties import get_municipalities
from facts.procurements.climate_requirements_in_procurements import get_procurement_data
from issues.emissions.emission_data_calculations import emission_calculations
from issues.consumption.consumption_data_calculations import get_consumption_emissions
from trafa.process_data import get_electric_car_change
# Notebook from ClimateView that our calculations are based on:
# https://colab.research.google.com/drive/1qqMbdBTu5ulAPUe-0CRBmFuh8aNOiHEb?usp=sharing

def create_dataframe(to_percentage: bool) -> pd.DataFrame:
    # Get emission calculations
    df = get_municipalities()
    print('1. Municipalities loaded and prepped')

    df = emission_calculations(df)
    print('2. Climate data and calculations added')

    df = get_electric_car_change_rate(df, to_percentage)
    print('3. Hybrid car data and calculations added')

    df = get_climate_plans(df)
    print('4. Climate plans added')

    df_bike_lanes = calculate_bike_lane_per_capita()
    df = df.merge(df_bike_lanes, on='Kommun', how='left')
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

def series_to_dict(row: pd.Series, numeric_columns: List[Any]) -> Dict:
    """
    Transforms a pandas Series into a dictionary.

    Args:
    row: The pandas Series to transform.

    Returns:
    A dictionary with the transformed data.
    """
    cdata = {
        'kommun': row['Kommun'],
        'län': row['Län'],
        'emissions': { str(year): row[year] for year in numeric_columns },
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
        'bicycleMetrePerCapita': row['bikeMetrePerCapita'],
        'totalConsumptionEmission': row['Total emissions'],
        'electricVehiclePerChargePoints': row['EVPC'],
        'procurementScore': row['procurementScore'],
        'procurementLink': row['procurementLink'],
    }
    return cdata

def round_processing(v, num_decimals: int):
    new_v = v
    if (isinstance(v, float)):
        new_v = np.round(v, num_decimals)
    elif (isinstance(v, dict)):
        new_v = {k: round_processing(a, num_decimals) for k, a in v.items()}
    return new_v

def max_decimals(entry: Dict, num_decimals: int) -> Dict:
    return {k: round_processing(v, num_decimals) for k, v in entry.items()}

def df_to_dict(df: pd.DataFrame, num_decimals: int) -> dict:
    numeric_columns = [col for col in df.columns if str(col).isdigit()]

    temp = []
    if num_decimals >= 0:
        temp = [ max_decimals(series_to_dict(df.iloc[i], numeric_columns), num_decimals) for i in range(len(df)) ]
    else:
        temp = [ series_to_dict(df.iloc[i], numeric_columns) for i in range(len(df)) ]
    return temp

def convert_df_to_dict(df: pd.DataFrame, numeric_columns: list) -> dict:
    temp = [
        {
            'kommun': df.iloc[i]['Kommun'],
            'län': df.iloc[i]['Län'],
            'emissions': { str(year): df.iloc[i][year] for year in numeric_columns },
            'budget': df.iloc[i]['Budget'],
            'emissionBudget': df.iloc[i]['parisPath'],
            'approximatedHistoricalEmission': df.iloc[i]['approximatedHistorical'],
            'totalApproximatedHistoricalEmission': df.iloc[i]['totalApproximatedHistorical'],
            'trend': df.iloc[i]['trend'],
            'trendEmission': df.iloc[i]['trendEmission'],
            'historicalEmissionChangePercent': df.iloc[i]['historicalEmissionChangePercent'],
            'neededEmissionChangePercent': df.iloc[i]['neededEmissionChangePercent'],
            'hitNetZero': df.iloc[i]['hitNetZero'],
            'budgetRunsOut': df.iloc[i]['budgetRunsOut'],
            'electricCarChangePercent': df.iloc[i]['electricCarChangePercent'],
            'electricCarChangeYearly': df.iloc[i]['electricCarChangeYearly'],
            'climatePlanLink': df.iloc[i]['Länk till aktuell klimatplan'],
            'climatePlanYear': df.iloc[i]['Antagen år'],
            'climatePlanComment': df.iloc[i]['Namn, giltighetsår, kommentar'],
            'bicycleMetrePerCapita': df.iloc[i]['metrePerCapita'],
            'totalConsumptionEmission': df.iloc[i]['Total emissions'],
            'electricVehiclePerChargePoints': df.iloc[i]['EVPC'],
            'procurementScore': df.iloc[i]['procurementScore'],
            'procurementLink': df.iloc[i]['procurementLink'],
        }
        for i in range(len(df))
    ]
    return temp


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Climate data calculations")
    parser.add_argument("-o", "--outfile", default="output/climate-data.json", type=str, help="Output filename (JSON formatted)")
    parser.add_argument("-t", "--to_percentage", action="store_true", default=False, help="Convert to percentages")
    parser.add_argument("-n", "--num_decimals", default=-1, type=int, help="Number of decimals to round to")


    args = parser.parse_args()

    df = create_dataframe(args.to_percentage)

    temp = df_to_dict(df, args.num_decimals)

    output_file = args.outfile

    with open(output_file, 'w', encoding='utf8') as json_file:
        # save dataframe as json file
        json.dump(temp, json_file, ensure_ascii=False, default=str)

    print('Climate data JSON file created and saved')
