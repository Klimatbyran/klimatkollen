# -*- coding: utf-8 -*-
import unittest
import pandas as pd

from issues.emissions.emission_data_calculations import get_n_prep_data_from_smhi, deduct_cement, calculate_municipality_budgets, calculate_paris_path, calculate_trend, calculate_change_percent, calculate_budget_runs_out
from tests.utilities import prep_dict_for_compare, str_to_dict

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
        
        # Extract paris path data dicts and prepare for comparison
        dicts_result = [prep_dict_for_compare(serie) for serie in df_result['parisPath']]
        dicts_expected = [prep_dict_for_compare(serie) for serie in df_expected['parisPath']]
    
        # Check length of data dicts
        self.assertEqual(len(dicts_result), len(dicts_expected))
        
        # Check content of data dicts
        for idx in range(len(dicts_expected)):
            with self.subTest(municipality = df_expected.iloc[idx]['Kommun']):        
                self.assertDictEqual(dicts_result[idx], dicts_expected[idx])
                
    def test_calculate_trend(self):
        path_input_df = 'tests/reference_dataframes/df_paris.xlsx'
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
        
    def test_calculate_change_percent(self):
        path_input_df = 'tests/reference_dataframes/df_trend.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_change_percent.xlsx'
        
        df_input = pd.DataFrame(pd.read_excel(path_input_df))  
        # Convert parisPath data dicts from str to dict
        df_input['parisPath'] = [str_to_dict(serie) for serie in df_input['parisPath']]
        df_result = calculate_change_percent(df_input)
        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))
        
        pd.testing.assert_series_equal(df_result['emissionChangePercent'], df_expected['emissionChangePercent'])

if __name__ == '__main__':
    unittest.main()