# -*- coding: utf-8 -*-
import unittest
import pandas as pd

from solutions.cars.car_data_calculations import calculate_cpev, calculate_percent_diff_from_ref_cpev, pivot_charging_data, filter_charging_point_data

YEAR_RANGE = range(2015, 2023) # IMPORTANT! This needs to be updated with new data to match current year range!

class TestChargingPointCalculations(unittest.TestCase):

    def test_filter_charging_point_data(self):
        # Mock raw input data on chargers per municipality from PowerCircle
        df_input = pd.DataFrame({
            'år-månad': ['2014-12', '2015-12', '2015-06', '2016-12', '2017-12', '2018-12', '2019-12', '2020-12', '2021-12', '2022-12'],
            'Pajala': [30, 0, 4, 0, 0, 0, 0, 0, 0, 10],
            'Sollentuna': [10, 0, 8, 0, 2, 5, 9, 19, 34, 34]
        })
    
        df_result = filter_charging_point_data(df_input)

        df_expected = pd.DataFrame({
            'year': [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
            'Pajala': [0, 0, 0, 0, 0, 0, 0, 10],
            'Sollentuna': [0, 0, 2, 5, 9, 19, 34, 34]
        })

        pd.testing.assert_frame_equal(df_result, df_expected)


    def test_pivot_charging_data(self):
        df_input = pd.DataFrame({
            'year': [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022],
            'Pajala': [0, 0, 0, 0, 0, 0, 0, 10],
            'Sollentuna': [0, 0, 2, 5, 9, 19, 34, 34]
        })

        df_result = pivot_charging_data(df_input)

        df_expected = pd.DataFrame({
            'Kommun': ['Pajala', 'Sollentuna'],
            2015: [0, 0,],
            2016: [0, 0],
            2017: [0, 2],
            2018: [0, 5],
            2019: [0, 9],
            2020: [0, 19],
            2021: [0, 34],
            2022: [10, 34]
        })

        pd.testing.assert_frame_equal(df_result, df_expected)


    def test_calculate_cpev(self):
        df_input = pd.DataFrame({
            'Kommun': ['Ale', 'Alingsås', 'Arboga'],
            '2015_x': [0, 0, 11],
            '2016_x': [3, 0, 11],
            '2017_x': [3, 13, 14],
            '2018_x': [6, 13, 20],
            '2019_x': [9, 13, 20],
            '2020_x': [9, 19, 20],
            '2021_x': [9, 19, 26],
            '2022_x': [9, 20, 36],
            '2015_y': [23, 35, 6],
            '2016_y': [38, 73, 16],
            '2017_y': [60, 128, 22],
            '2018_y': [101, 190, 31],
            '2019_y': [166, 264, 63],
            '2020_y': [337, 550, 110],
            '2021_y': [691, 996, 202],
            '2022_y': [1133, 1555, 311]
        })

        df_result = calculate_cpev(df_input, YEAR_RANGE)

        df_expected = pd.DataFrame({
            'Kommun': ['Ale', 'Alingsås', 'Arboga'],
            'CPEV': [{2015: 0/23, 2016: 3/38, 2017: 3/60, 2018: 6/101, 2019: 9/166, 2020: 9/337, 2021: 9/691, 2022: 9/1133},
                     {2015: 0/35, 2016: 0/73, 2017: 13/128, 2018: 13/190, 2019: 13/264, 2020: 19/550, 2021: 19/996, 2022: 20/1555},
                     {2015: 11/6, 2016: 11/16, 2017: 14/22, 2018: 20/31, 2019: 20/63, 2020: 20/110, 2021: 26/202, 2022: 36/311}]
        })

        pd.testing.assert_frame_equal(df_result, df_expected)


    def test_calculate_percent_diff_from_ref_cpev(self):
        df_input = pd.DataFrame({
            'Kommun': ['Ale', 'Alingsås', 'Arboga'],
            'CPEV': [{2015: 0/23, 2016: 3/38, 2017: 3/60, 2018: 6/101, 2019: 9/166, 2020: 9/337, 2021: 9/691, 2022: 9/1133},
                     {2015: 0/35, 2016: 0/73, 2017: 13/128, 2018: 13/190, 2019: 13/264, 2020: 19/550, 2021: 19/996, 2022: 20/1555},
                     {2015: 11/6, 2016: 11/16, 2017: 14/22, 2018: 20/31, 2019: 20/63, 2020: 20/110, 2021: 26/202, 2022: 36/311}]
        })

        df_result = calculate_percent_diff_from_ref_cpev(df_input)

        df_expected = pd.DataFrame({
            'Kommun': ['Ale', 'Alingsås', 'Arboga'],
            'CPEV': [{2015: 0/23, 2016: 3/38, 2017: 3/60, 2018: 6/101, 2019: 9/166, 2020: 9/337, 2021: 9/691, 2022: 9/1133},
                     {2015: 0/35, 2016: 0/73, 2017: 13/128, 2018: 13/190, 2019: 13/264, 2020: 19/550, 2021: 19/996, 2022: 20/1555},
                     {2015: 11/6, 2016: 11/16, 2017: 14/22, 2018: 20/31, 2019: 20/63, 2020: 20/110, 2021: 26/202, 2022: 36/311}],
            'CPEVDiff': [{2015: -100.0, 2016: -21.052631578947377, 2017: -50.0, 2018: -40.594059405940605, 2019: -45.78313253012048, 2020: -73.29376854599407, 2021: -86.97539797395079, 2022: -92.05648720211826}, 
                         {2015: -100.0, 2016: -100.0, 2017: 1.5624999999999944, 2018: -31.57894736842105, 2019: -50.75757575757576, 2020: -65.45454545454545, 2021: -80.92369477911646, 2022: -87.13826366559486}, 
                         {2015: 1733.3333333333333, 2016: 587.5, 2017: 536.3636363636364, 2018: 545.1612903225806, 2019: 217.46031746031744, 2020: 81.81818181818181, 2021: 28.71287128712871, 2022: 15.755627009646291}]
        })

        pd.testing.assert_frame_equal(df_result, df_expected)
