import pandas as pd


# calculations based on trafa data
PATH_CARS_DATA = "solutions/cars/sources/kpi1_calculations.xlsx"

def clean_up_dataframe(df) -> pd.DataFrame:
    # Clean up the dataframe
    df.columns = df.iloc[1]  # name columns after row
    df = df.drop([0, 1])  # drop usless rows
    df = df.reset_index(drop=True)
    return df

def get_change_percent(df: pd.DataFrame) -> pd.Series:
    return df["Procentenheter förändring av andel laddbara bilar 2015-2022"] * 100.0

def get_change_yearly(df: pd.DataFrame) -> pd.Series:
    years = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
    return df.apply(
        lambda x: {year: x.loc[year] * 100.0 for year in years},
        axis=1)

def get_filtered_result(df: pd.DataFrame) -> pd.DataFrame:
    return df.filter(
        ["Kommun", "electricCarChangePercent", "electricCarChangeYearly"], axis=1)

def get_electric_car_change_rate(df: pd.DataFrame) -> pd.DataFrame:
    # LOAD AND PREP DATA ON CHANGE RATE OF PERCENTAGE OF NEWLY REGISTERED RECHARGABLE CARS PER MUNICIPALITY AND YEAR
    df_raw_cars = pd.read_excel(PATH_CARS_DATA)

    df_raw_cars = clean_up_dataframe(df_raw_cars)

    df_raw_cars["electricCarChangePercent"] = get_change_percent(df_raw_cars)
    
    df_raw_cars["electricCarChangeYearly"] = get_change_yearly(df_raw_cars)

    df_cars = get_filtered_result(df_raw_cars)

    df = df.merge(df_cars, on="Kommun", how="left")

    return df