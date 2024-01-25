# -*- coding: utf-8 -*-
import ast
import unittest
import datetime
import pandas as pd

from issues.emissions.emission_data_calculations import get_n_prep_data_from_smhi, deduct_cement, calculate_municipality_budgets, calculate_paris_path, calculate_trend, calculate_change_percent, calculate_budget_runs_out
from tests.utilities import prep_dict_for_compare

class TestEmissionCalculations(unittest.TestCase):
    
    def test_get_n_prep_data_from_smhi(self):
        path_input_df = 'tests/reference_dataframes/df_municipalities.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_smhi.xlsx'
        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))
        df_result = get_n_prep_data_from_smhi(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        pd.testing.assert_frame_equal(df_result, df_expected, check_dtype=False)

    def test_deduct_cement(self):
        path_input_df = 'tests/reference_dataframes/df_smhi.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_cem.xlsx'
        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))
        df_result = deduct_cement(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        pd.testing.assert_frame_equal(df_result, df_expected, check_dtype=False)
        
    def test_calculate_municipality_budgets(self):
        path_input_df = 'tests/reference_dataframes/df_cem.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_budgeted.xlsx'
        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))
        df_result = calculate_municipality_budgets(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        pd.testing.assert_frame_equal(df_result, df_expected, check_dtype=False)
    
    def test_calculate_paris_path(self):
        path_input_df = 'tests/reference_dataframes/df_budgeted.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_paris.xlsx'
        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))
        df_result = calculate_paris_path(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        
        # Extract paris path data series and prepare for comparison
        series_result = [prep_dict_for_compare(serie) for serie in df_result['parisPath']]
        series_expected = [prep_dict_for_compare(serie) for serie in df_expected['parisPath']]
    
        # Check length of series
        self.assertEqual(len(series_result), len(series_expected))
        
        # Check content of data series, per municipality
        for idx in range(len(series_expected)):
            with self.subTest(expected = series_expected[idx]):        
                self.assertDictEqual(series_result[idx], series_expected[idx])

if __name__ == '__main__':
    unittest.main()