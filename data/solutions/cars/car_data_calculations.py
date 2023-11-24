# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd
from scipy.stats import linregress

# data on sold cars by trafa
trafa_paths = {
    2015: "solutions/cars/sources/fordon_lan_och_kommuner_2015.xlsx",
    2016: "solutions/cars/sources/fordon_lan_och_kommuner_2016.xlsx",
    2017: "solutions/cars/sources/fordon_lan_och_kommuner_2017_rev.xlsx",
    2018: "solutions/cars/sources/fordon_lan_och_kommuner_2018.xlsx",
    2019: "solutions/cars/sources/fordon_lan_och_kommuner_2019.xlsx",
    2020: "solutions/cars/sources/fordon_lan_och_kommuner_2020.xlsx",
    2021: "solutions/cars/sources/fordon_lan_och_kommuner_2021.xlsx",
    2022: "solutions/cars/sources/fordon_lan_och_kommuner_2022.xlsx",
}

# calculations based on trafa data
PATH_CARS_DATA = "solutions/cars/sources/kpi1_calculations.xlsx"
PATH_CHARGING_POINT = "solutions/cars/sources/charging_points_powercircle.csv"
PATH_POPULATION = "solutions/cars/sources/population_scb.xlsx"
PATH_POPULATION_DENSITY = "solutions/cars/sources/scb_population_density.xlsx"


def get_electric_car_change(df):
    # LOAD AND PREP DATA ON CHANGE RATE OF PERCENTAGE OF NEWLY REGISTERED RECHARGABLE CARS PER MUNICIPALITY AND YEAR
    df_raw_cars = pd.read_excel(PATH_CARS_DATA)

    df_raw_cars.columns = df_raw_cars.iloc[1]  # name columns after row
    df_raw_cars = df_raw_cars.drop([0, 1])  # drop usless rows
    df_raw_cars = df_raw_cars.reset_index(drop=True)

    df_raw_cars["electricCarChangePercent"] = df_raw_cars[
        "Procentenheter förändring av andel laddbara bilar 2015-2022"
    ]
    df_raw_cars["electricCarChangeYearly"] = df_raw_cars.apply(
        lambda x: {
            2015: x.loc[2015],
            2016: x.loc[2016],
            2017: x.loc[2017],
            2018: x.loc[2018],
            2019: x.loc[2019],
            2020: x.loc[2020],
            2021: x.loc[2021],
            2022: x.loc[2022],
        },
        axis=1,
    )

    df_cars = df_raw_cars.filter(
        ["Kommun", "electricCarChangePercent", "electricCarChangeYearly"], axis=1
    )

    df = df.merge(df_cars, on="Kommun", how="left")

    return df


def filter_charging_point_data(df_raw):
    df_filtered = df_raw[df_raw["år-månad"].str.endswith("-12")].reset_index(drop=True)
    df_filtered.rename(columns={"år-månad": "year"}, inplace=True)
    df_filtered["year"] = df_filtered["year"].str[:-3]
    df_filtered["year"] = df_filtered["year"].astype(
        int
    )  # convert the 'year' column to an integer for comparison
    df_filtered = df_filtered[
        df_filtered["year"] >= 2015
    ]  # filter out rows where the year is earlier than 2015
    df_filtered = df_filtered.reset_index(drop=True)
    return df_filtered


def pivot_charging_data(df_input):
    df_melted = pd.melt(
        df_input, id_vars=["year"], var_name="Kommun", value_name="Value"
    )
    df_pivoted = df_melted.pivot(
        index="Kommun", columns="year", values="Value"
    ).reset_index()
    df_pivoted["Kommun"] = df_pivoted["Kommun"].str.title()
    df_pivoted.columns.name = None
    return df_pivoted


def set_dataframe_columns(df, header_row):
    df.columns = df.iloc[header_row]
    return df.drop(range(header_row + 4))


def clean_municipality_data(df):
    df["Kommun"] = df["Kommun"].str.strip()
    df = df.drop(
        df[
            df["Kommun"].isin(["Okänd Kommun   ", "OKÄND KOMMUN", "OKÄND KOMMUN1)"])
        ].index
    )
    return df.dropna(subset=["Kommun"])


def process_common_data(df, year):
    df["electricity"] = df["El"].replace([" –", "–"], 0).astype(float)
    df["plugIn"] = df["Laddhybrider"].replace([" –", "–"], 0).astype(float)
    df[year] = df["electricity"] + df["plugIn"]
    return df.filter(["Kommun", year], axis=1)


def load_and_process_trafa_data(path, year):
    # Define sheet names and header rows for each year
    sheet_details = {
        "2015": ("RSK-Tabell 3 2015", 4),
        "2016": ("Tabell 3", 4),
        "2018": ("Tabell 4", 4),
        "2021": ("Tabell 4", 2),
        "2022": ("Tabell 4 Personbil", 2),
    }

    default_sheet, default_header = ("Tabell 4", 4)  # default sheet details
    sheet_name, header_row = sheet_details.get(
        str(year), (default_sheet, default_header)
    )  # choose the sheet name and header row based on the year

    df = pd.read_excel(path, sheet_name=sheet_name)
    df = set_dataframe_columns(df, header_row)
    df = clean_municipality_data(df)
    df = process_common_data(df, year)
    return df


def calculate_cpev(df_result, year_range):
    # Initialize a new column for CPEV values
    df_result["CPEV"] = pd.NA

    for index, row in df_result.iterrows():
        # Temporary dictionary to hold CPEV values for each year
        cpev_values = {}

        for year in year_range:
            c_column = f"{year}_x"
            ev_column = f"{year}_y"

            # Calculate CPEV for each year
            cpev = row[c_column] / row[ev_column] if row[ev_column] != 0 else 0
            cpev_values[year] = cpev

        df_result.at[index, "CPEV"] = cpev_values

    # Only keep 'Kommun' and 'CPEV' columns
    df_result = df_result[["Kommun", "CPEV"]]
    print(df_result.head())

    return df_result


def calculate_percent_diff_from_ref_cpev(df):
    ref_CPEV = 0.1  # reference based on EU goal
    df["CPEVDiff"] = pd.NA  # Initialize a new column for percent differences

    for index, row in df.iterrows():
        cpev_dict = row["CPEV"]
        percent_diff = {}

        for year, cpev in cpev_dict.items():
            # Calculate percent difference for each year
            percent_diff[year] = ((cpev - ref_CPEV) / ref_CPEV) * 100

        # Assign the dictionary of percent differences to the new column
        df.at[index, "CPEVDiff"] = percent_diff

    return df


def get_cpev_and_average_yearly_cpev_change():
    # Load and process charging point data
    df_charging_raw = pd.read_csv(PATH_CHARGING_POINT)
    df_charging_filtered = filter_charging_point_data(df_charging_raw)
    df_charging_pivoted = pivot_charging_data(df_charging_filtered)

    # Produce output dataframe
    df = pd.DataFrame()
    df["Kommun"] = df_charging_pivoted["Kommun"]
    df = df.drop(index=range(290, len(df)))

    year_range = [col for col in df_charging_pivoted.columns if isinstance(col, int)]

    # Load and process Trafa data for each year
    for year, path in trafa_paths.items():
        df_year = load_and_process_trafa_data(path, year)
        df_charging_pivoted = df_charging_pivoted.merge(
            df_year, on="Kommun", how="left"
        )

    # Add charging points per electric vehicle (CPEV) and calculate average CPEV level
    df_cpev = calculate_cpev(df_charging_pivoted, year_range)
    df_cpev_diff = calculate_percent_diff_from_ref_cpev(df_cpev)
    print(df_cpev_diff.head())
    # df_result.to_excel('output/charging_float.xlsx')

    return


get_cpev_and_average_yearly_cpev_change()
