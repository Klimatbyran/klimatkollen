# -*- coding: utf-8 -*-
import numpy as np
import pandas as pd
from typing import Dict, List, Any

import json
import argparse
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
    """
    Builds a pandas DataFrame from the climate data.

    Returns:
    A pandas DataFrame with the climate data.
    """
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


def transform_row(row: pd.Series, numeric_columns: List[Any]) -> Dict:
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
        'bicycleMetrePerCapita': row['metrePerCapita'],
        'totalConsumptionEmission': row['Total emissions'],
        'electricVehiclePerChargePoints': row['EVPC'],
        'procurementScore': row['procurementScore'],
        'procurementLink': row['procurementLink'],
    }
    return cdata

def _round_floats(row: pd.Series, num_decimals: int) -> pd.Series:
    """
    Rounds all floating point numbers in a pandas Series to a defined number of decimals.

    Args:
    row: The pandas Series to round.
    num_decimals: The number of decimal places to round to.

    Returns:
    A new pandas Series with the rounded values.
    """
    if num_decimals >= 0:
        return row.apply(lambda x: np.round(x, num_decimals) if pd.api.types.is_float_dtype(x) else x)
    
    return row

def round_processing(v, num_decimals: int):
    """
    """
    new_v = v
    if (isinstance(v, float)):
        new_v = np.round(v, num_decimals)
    elif (isinstance(v, dict)):
        new_v = {k: round_processing(a, num_decimals) for k, a in v.items()}
    return new_v

def round_floats(entry: Dict, num_decimals: int) -> Dict:
    return {k: round_processing(v, num_decimals) for k, v in entry.items()}

def store_dataframe(df: pd.DataFrame, output_file: str):
    with open(output_file, 'w', encoding='utf8') as json_file:
        # save dataframe as json file
        json.dump(df, json_file, ensure_ascii=False, default=str)

    print('Climate data JSON file created and saved')
    
if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Climate data calculations")
    parser.add_argument("-n", "--num_decimals", default=-1, type=int, help="Number of decimals to round to")
    parser.add_argument("-o", "--outfile", default="output/climate-data.json", type=str, help="Output filename (JSON formatted)")
    args = parser.parse_args()

    df = build_dataframe()
    numeric_columns = [col for col in df.columns if str(col).isdigit()]
    
    if args.num_decimals >= 0:
        temp = [ round_floats(transform_row(df.iloc[i], numeric_columns), args.num_decimals) for i in range(len(df)) ]
        if args.outfile == "output/climate-data.json":
            output_file = f"output/climate-data-rounded.json"
        else:
            output_file = args.outfile

        store_dataframe(temp, output_file)
    else:
        temp = [ transform_row(df.iloc[i], numeric_columns) for i in range(len(df)) ]
        store_dataframe(temp, args.outfile)

