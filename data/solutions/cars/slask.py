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

    # Default sheet details
    default_sheet, default_header = ("Tabell 4", 4)

    # Choose the sheet name and header row based on the year (2017 and 2019-2020 are default)
    sheet_name, header_row = sheet_details.get(
        str(year), (default_sheet, default_header)
    )

    # Load data
    df = pd.read_excel(path, sheet_name=sheet_name)

    # Set columns and drop initial rows
    df = set_dataframe_columns(df, header_row)

    # Clean municipality data
    df = clean_municipality_data(df)

    # Process common data and return
    return process_common_data(df, year)


def load_charging_point_data():
    df_charging_raw = pd.read_csv(PATH_CHARGING_POINT)
    df_charging_filtered = df_charging_raw[
        df_charging_raw["år-månad"].str.endswith("-12")
    ].reset_index(drop=True)
    df_charging_filtered.rename(columns={"år-månad": "year"}, inplace=True)
    df_charging_filtered["year"] = df_charging_filtered["year"].str[:-3]
    return df_charging_filtered


def pivot_charging_data(df_charging_filtered):
    df_charging_melted = pd.melt(
        df_charging_filtered, id_vars=["year"], var_name="Kommun", value_name="Value"
    )
    df_charging_pivoted = df_charging_melted.pivot(
        index="Kommun", columns="year", values="Value"
    ).reset_index()
    df_charging_pivoted["Kommun"] = df_charging_pivoted["Kommun"].str.title()
    return df_charging_pivoted


def convert_column_to_float(df, year_range):
    for year in year_range:
        df.rename(columns={f"{year}": float(year)}, inplace=True)
    return df


def calculate_average_yearly_change(df, column_name, year_range):
    # reimplement if needed again, old version was faulty
    return


def linest_python(df, year_range):
    # Convert year_range to a list of strings, as DataFrame columns are typically strings
    year_columns = [year for year in year_range]

    # Ensure columns are numeric and handle NaNs
    df[year_columns] = df[year_columns].apply(pd.to_numeric, errors="coerce")

    # Define a function to apply linear regression to each row
    def apply_linest(row):
        # Use dropna to remove NaN values
        y = row[year_columns].dropna().values  # Values for regression
        if len(y) < 2:  # Need at least two points to perform regression
            return pd.Series({"slope": np.nan, "intercept": np.nan})

        x = np.array(
            [
                year
                for year, value in zip(year_range, row[year_columns])
                if not np.isnan(value)
            ]
        )

        y_float = [float(item) for item in y]
        x_float = [float(item) for item in x]
        m, c = np.polyfit(
            x_float, y_float, 1
        )  # Fit a linear model (degree 1 for linear regression)
        return pd.Series({"slope": round(m, 4), "intercept": round(c, 4)})

    # Apply the function to each row
    regression_results = df.apply(apply_linest, axis=1)

    df_concat = pd.concat([df, regression_results], axis=1)
    print(df_concat.head())

    return df_concat


def calculate_average_cpev_level(df, year_range):
    ref_CPEV = 0.1

    # Define a function that calculates the average CPEV for a row
    def calc_row_average(row):
        CPEV = [row[year] for year in year_range]
        # Subtract the reference CPEV from each year's CPEV
        c = [value - ref_CPEV for value in CPEV if not np.isnan(value)]
        # Calculate the mean of the diff
        m = np.mean(c) if c else 0  # Avoid division by zero if c is empty
        return round((ref_CPEV + m) / ref_CPEV * 100, 1)

    # Apply the function to each row
    df["averageCPEV"] = df.apply(calc_row_average, axis=1)

    return df


def load_trafa_data(df):
    # Load and process Trafa data for each year
    for year, path in trafa_paths.items():
        df_year = load_and_process_trafa_data(path, year)
        df = df.merge(df_year, on="Kommun", how="left")

    # Filter to keep only relevant columns
    columns_to_keep = ["Kommun"] + list(year_range)
    df = df[columns_to_keep]

    return df


def calculate_cpev(df_result, df_charging_points, year_range):
    # Load and process Trafa data for each year
    for year, path in trafa_paths.items():
        df_year = load_and_process_trafa_data(path, year)
        df_result = df_result.merge(df_year, on="Kommun", how="left")

    df_result = df_result.merge(df_charging_points, on="Kommun", how="left")

    # Calculate yearly changes in CPEV for each municipality
    for year in year_range:
        c_column = f"{year}.0_y"
        ev_column = f"{year}_x"

        # Calculate CPEV for each year and create a new column for that year
        df_result[year] = df_result.apply(
            lambda row: row[c_column] / row[ev_column] if row[ev_column] != 0 else 0,
            axis=1,
        )

    # Filter to keep only relevant columns
    columns_to_keep = ["Kommun"] + list(year_range)
    df_result = df_result[columns_to_keep]

    return df_result


def charging_points_per_population_density(df_charging_points, year_range):
    df_population_density = pd.read_excel(PATH_POPULATION_DENSITY)

    columns_list = df_population_density.iloc[1].tolist()
    columns_list[0] = "Kommun"
    df_population_density.columns = columns_list
    df_population_density = df_population_density.drop([0, 1])

    # fixme fortsätt här, beräkna charging points per population density per år genom att slå ihop df:arna

    print(df_population_density.columns)
    print(df_population_density.head())
    return


def charging_point_calculations():
    year_range = range(
        2015, 2023
    )  # IMPORTANT! This needs to be updated with new data to match current year range!
    df_result = pd.DataFrame()

    # Load and process charging point data
    df_charging_filtered = load_charging_point_data()
    df_charging_pivoted = pivot_charging_data(df_charging_filtered)

    df_result["Kommun"] = df_charging_pivoted[
        "Kommun"
    ]  # Assign municipality column to result dataframe
    df_result = df_result.drop(index=range(290, len(df_result)))
    df_charging_float = convert_column_to_float(df_charging_pivoted, year_range)

    # Add charging points per electric vehicle (CPEV) and calculate average CPEV level
    df_result = calculate_cpev(df_result, df_charging_float, year_range)
    df_result = calculate_average_cpev_level(df_result, year_range)
    df_result.to_excel("output/charging_float.xlsx")

    # Add charging points/population density
    # df_cppd = charging_points_per_population_density(df_charging_float, year_range)

    smallest = df_result["slope"].min()
    largest = df_result["slope"].max()
    mean = df_result["slope"].mean()
    print("min ", smallest)
    print("max ", largest)
    print("mean ", mean)

    # # df = df.merge(df_result_filtered, on='Kommun', how='left')

    # # return df
