# -*- coding: utf-8 -*-
import unittest
from unittest.mock import patch
import pandas as pd

from data.solutions.cars.car_data_calculations import charging_point_calculations

class TestChargingPointCalculations(unittest.TestCase):

    @patch('pandas.read_csv')
    @patch('pandas.read_excel')
    def test_charging_point_calculations(self, mock_read_excel, mock_read_csv):
        # Sample data for the main DataFrame (df)
        df = pd.DataFrame({
            'Kommun': ['Pajala', 'Sollentuna'],
        })

        # Sample data for df_charging
        df_charging_raw = pd.DataFrame({
            'år-månad': ['2015-12', '2016-12'],
            'Pajala': [10, 20],
            'Sollentuna': [30, 40]
        })

        # Sample data for df_population
        df_population = pd.DataFrame({
            'Kommun': ['Pajala', 'Sollentuna'],
            2015: [100, 200],
            2016: [110, 220]
        })

        print(df_charging_raw)
        print(df_population)

        # Call the function
        df_result = charging_point_calculations(df, df_charging_raw, df_population)

        # Verify the ChargingPointsPerCapita calculations
        expected_df = pd.DataFrame({
            'Kommun': ['Pajala', 'Sollentuna'],
            'Year': [2015, 2016],
            'ChargingPointsPerCapita': [0.1, 0.18181818181818182, 0.15, 0.18181818181818182]
        })

        pd.testing.assert_frame_equal(df_result, expected_df)
