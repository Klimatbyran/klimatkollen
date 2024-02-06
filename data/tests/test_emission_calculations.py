# -*- coding: utf-8 -*-
import unittest
import pandas as pd
import numpy as np

from issues.emissions.emission_data_calculations import get_n_prep_data_from_smhi, deduct_cement, calculate_municipality_budgets, calculate_paris_path, calculate_trend, calculate_change_percent, calculate_hit_net_zero, calculate_budget_runs_out
from tests.utilities import prep_dict_for_compare, str_to_dict, prep_date_str_for_compare, str_to_numpy_array

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
    
                
    def test_calculate_trend(self):
        path_input_df = 'tests/reference_dataframes/df_budgeted.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_trend.xlsx'
        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))
        df_result = calculate_trend(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        
        # Extract trend data dicts and prepare for comparison
        dicts_result = [prep_dict_for_compare(serie) for serie in df_result['trend']]
        dicts_expected = [prep_dict_for_compare(serie) for serie in df_expected['trend']]
    
        # Check length of data dicts
        self.assertEqual(len(dicts_result), len(dicts_expected))
        
        # Check content of data dicts
        for idx in range(len(dicts_expected)):
            with self.subTest(municipality = df_expected.iloc[idx]['Kommun']):  
                self.assertEqual(dicts_result[idx], dicts_expected[idx])
                
        # Check trend emission data series
        pd.testing.assert_series_equal(df_result['trendEmission'], df_expected['trendEmission'], check_index=False)
        
    def test_calculate_paris_path(self):
        path_input_df = 'tests/reference_dataframes/df_trend.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_paris.xlsx'
        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))
        df_result = calculate_paris_path(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        
        # Extract paris path data dicts and prepare for comparison
        dicts_result = [prep_dict_for_compare(serie) for serie in df_result['parisPath']]
        dicts_expected = [prep_dict_for_compare(serie) for serie in df_expected['parisPath']]
    
        # Check length of data dicts
        self.assertEqual(len(dicts_result), len(dicts_expected))
        
        # Check content of data dicts
        for idx in range(len(dicts_expected)):
            with self.subTest(municipality = df_expected.iloc[idx]['Kommun']):        
                self.assertDictEqual(dicts_result[idx], dicts_expected[idx])
                
                
    def test_calculate_change_percent(self):
        path_input_df = 'tests/reference_dataframes/df_paris.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_change_percent.xlsx'
        
        # Get input df and convert parisPath data dicts from str to dict
        df_input = pd.DataFrame(pd.read_excel(path_input_df)) 
        df_input['parisPath'] = [str_to_dict(serie) for serie in df_input['parisPath']]
        
        df_result = calculate_change_percent(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        
        pd.testing.assert_series_equal(df_result['emissionChangePercent'], df_expected['emissionChangePercent'])
        
    def test_calculate_hit_net_zero(self):
        path_input_df = 'tests/reference_dataframes/df_change_percent.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_net_zero.xlsx'
        
        # Get input df and convert trend data dicts from str to dict
        df_input = pd.DataFrame(pd.read_excel(path_input_df))  
        df_input['trendCoefficients'] = [str_to_numpy_array(array) for array in df_input['trendCoefficients']]
        df_input['trend'] = [str_to_dict(serie) for serie in df_input['trend']]
        
        df_result = calculate_hit_net_zero(df_input)
        
        # Get expected df
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
    
        # Extract hit net zero dates and prepare for comparison
        df_result['hitNetZero'] = [prep_date_str_for_compare(date) for date in df_result['hitNetZero']]
        df_expected['hitNetZero'] = [prep_date_str_for_compare(date) for date in df_expected['hitNetZero']]
        
        pd.testing.assert_series_equal(df_result['hitNetZero'], df_expected['hitNetZero'])

    def test_calculate_budget_runs_out(self):
        path_input_df = 'tests/reference_dataframes/df_net_zero.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_budget_runs_out.xlsx'
        
        # Get input df and convert trend data dicts from str to dict        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))
        df_input['trendCoefficients'] = [str_to_numpy_array(array) for array in df_input['trendCoefficients']] 
        df_input['trend'] = [str_to_dict(serie) for serie in df_input['trend']]
        
        df_result = calculate_budget_runs_out(df_input)
    
        # Get expected df
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        
        # Extract budget runs out dates and prepare for comparison
        df_result['budgetRunsOut'] = [prep_date_str_for_compare(date) for date in df_result['budgetRunsOut']]
        df_expected['budgetRunsOut'] = [prep_date_str_for_compare(date) for date in df_expected['budgetRunsOut']]
        
        pd.testing.assert_series_equal(df_result['budgetRunsOut'], df_expected['budgetRunsOut'])
        

if __name__ == '__main__':
    unittest.main()