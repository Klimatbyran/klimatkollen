import numpy as np


def calculate_trend_coefficients(df, last_year_with_smhi_data):
    """
    Calculate linear trend coefficients for each municipality based on SMHI data from 2015 onwards.

    Parameters:
    - df: DataFrame containing the data for each municipality.
    - last_year_with_smhi_data: The last year for which SMHI data is available.

    Returns:
    - df: DataFrame with an additional column 'trendCoefficients' containing
          the calculated trend coefficients for each municipality.
    """

    temp = [] # temporary list that we will append to
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # Get the years we will use for the curve fit
        # NOTE: Years range can be changed
        x = np.arange(2015, last_year_with_smhi_data+1)
        # Get the emissions from the years specified in the line above
        y = np.array(df.iloc[i][x], dtype=float)
        # Fit a straight line to the data defined above using least squares
        fit = np.polyfit(x, y, 1)
        temp.append(fit)

    df['trendCoefficients'] = temp

    return df


def calculate_trend(df, last_year_with_smhi_data, correct_year):
    """
    Calculate the trend line for future years up to 2050 using interpolation
    and previously calculated linear trend coefficients.

    Args:
        df (pandas.DataFrame): The input DataFrame containing the data.
        last_year_with_smhi_data (int): The last year with SMHI data available.
        correct_year (int): The correct year to start the trend line from.

    Returns:
        pandas.DataFrame: The input DataFrame with additional columns
                          for the trend line and trend emission values.
    """

    # Calculate trend line for future years up to 2050
    # This is done by interpolation using previously calculated linear trend coefficients

    # Get years between next year and 2050
    future_years = range(correct_year+1, 2050+1)

    temp = []     # temporary list that we will append to
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # We'll store the future trend line for each municipality in a dictionary where the keys are the years
        # Add the latest recorded datapoint to the dict. The rest of the years will be added below.
        last_year_with_data_dict = {last_year_with_smhi_data: df.iloc[i][last_year_with_smhi_data]}

        # If approximated historical values exist, overwrite trend dict to start from current year
        if correct_year > last_year_with_smhi_data:
            last_year_with_data_dict = {correct_year:
                df.iloc[i]['approximatedHistorical'][correct_year]}

        # Get the trend coefficients
        fit = df.iloc[i]['trendCoefficients']

        for year in future_years:
            # Add the trend value for each year using the trend line coefficients. Max function so we don't get negative values
            last_year_with_data_dict[year] = max(0, fit[0]*year+fit[1])
        temp.append(last_year_with_data_dict)

    df['trend'] = temp

    temp = [
        np.trapz(
            list(df.iloc[i]['trend'].values()),
            list(df.iloc[i]['trend'].keys()),
        )
        for i in range(len(df))
    ]
    df['trendEmission'] = temp

    return df
