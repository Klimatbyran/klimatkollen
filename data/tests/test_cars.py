# -*- coding: utf-8 -*-
import unittest
from unittest.mock import patch
import pandas as pd

from data.solutions.cars.car_data_calculations import charging_points_per_population_density

class TestChargingPointCalculations(unittest.TestCase):

    def test_charging_points_per_population_density(self):
        # Sample data
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

        # Call the function
        df_result = charging_points_per_population_density(df_charging, year_range)

        # Verify the ChargingPointsPerYear calculations
        expected_df = pd.DataFrame({
            'Kommun': ['Pajala', 'Sollentuna'],
            'Year': [2015, 2016],
            'ChargingPointsPerYear': [0.1, 0.18181818181818182, 0.15, 0.18181818181818182]
        })

        pd.testing.assert_frame_equal(df_result, expected_df)
