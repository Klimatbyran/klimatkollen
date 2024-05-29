import numpy as np


def calculate_approximated_historical(df, last_year_with_smhi_data, current_year):
    """
    Calculate approximated historical data values for years passed since the last year with SMHI data.
    This is done by interpolation using previously calculated linear trend coefficients.

    Args:
        df (pandas.DataFrame): The input DataFrame containing the data.
        last_year_with_smhi_data (int): The last year with SMHI data.
        current_year (int): The current year.

    Returns:
        pandas.DataFrame: The DataFrame with the approximated historical data values added.

    """

    # Get the years passed since last year with SMHI data (including current year)
    approximated_years = range(last_year_with_smhi_data+1, current_year+1)

    temp = [] # temporary list that we will append to
    df = df.sort_values('Kommun', ascending=True)
    for i in range(len(df)):
        # We'll store the approximated values for each municipality
        # in a dictionary where the keys are the years
        approximated_data_dict = {}

        if list(approximated_years):  # only fill dict if approximation is needed
            # Add the latest recorded datapoint to the dict
            # The rest of the years will be added below
            approximated_data_dict = {last_year_with_smhi_data:
                df.iloc[i][last_year_with_smhi_data]}
            # Get trend coefficients
            fit = df.iloc[i]['trendCoefficients']

            for year in approximated_years:
                # Add the approximated value for each year using the trend line coefficients
                # Max function so we don't get negative values
                approximated_data_dict[year] = max(0, fit[0]*year+fit[1])

        temp.append(approximated_data_dict)

    df['approximatedHistorical'] = temp

    temp = [
        np.trapz(
            list(df.iloc[i]['approximatedHistorical'].values()),
            list(df.iloc[i]['approximatedHistorical'].keys()),
        )
        for i in range(len(df))
    ]
    df['totalApproximatedHistorical'] = temp

    return df
