# -*- coding: utf-8 -*-
import datetime
import unittest
import pandas as pd

from issues.emissions.emission_data_calculations import calculate_historical_change_percent, get_n_prep_data_from_smhi, deduct_cement, calculate_municipality_budgets, calculate_paris_path, calculate_trend, calculate_needed_change_percent, calculate_hit_net_zero, calculate_budget_runs_out
from tests.utilities import get_df_from_excel, prep_floats_for_compare, prep_date_str_for_compare

class TestEmissionCalculations(unittest.TestCase):
    
    def test_get_n_prep_data_from_smhi(self):
        path_input_df = 'tests/reference_dataframes/df_municipalities.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_smhi.xlsx'
        
        df_input = get_df_from_excel(path_input_df)
        df_result = get_n_prep_data_from_smhi(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        pd.testing.assert_frame_equal(df_result, df_expected, check_dtype=False)

    def test_deduct_cement(self):
        path_input_df = 'tests/reference_dataframes/df_smhi.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_cem.xlsx'
        
        df_input = get_df_from_excel(path_input_df)
        df_result = deduct_cement(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        pd.testing.assert_frame_equal(df_result, df_expected, check_dtype=False)
        
    def test_calculate_municipality_budgets(self):
        path_input_df = 'tests/reference_dataframes/df_cem.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_budgeted.xlsx'
        
        df_input = get_df_from_excel(path_input_df)
        df_result = calculate_municipality_budgets(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        pd.testing.assert_frame_equal(df_result, df_expected, check_dtype=False)
    
                
    def test_calculate_trend(self):
        path_input_df = 'tests/reference_dataframes/df_budgeted.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_trend.xlsx'
        
        df_input = get_df_from_excel(path_input_df)
        df_result = calculate_trend(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        
        # Extract trend data dicts and prepare floats for comparison (ignore round off differences due to floating point)
        dicts_result = [prep_floats_for_compare(dict) for dict in df_result['trend']]
        dicts_expected = [prep_floats_for_compare(dict) for dict in df_expected['trend']]
    
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
        
        df_input = get_df_from_excel(path_input_df)
        df_result = calculate_paris_path(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        
        # Extract paris path data dicts and prepare floats for comparison (ignore round off differences due to floating point)
        dicts_result = [prep_floats_for_compare(dict) for dict in df_result['parisPath']]
        dicts_expected = [prep_floats_for_compare(dict) for dict in df_expected['parisPath']]
    
        # Check length of data dicts
        self.assertEqual(len(dicts_result), len(dicts_expected))
        
        # Check content of data dicts
        for idx in range(len(dicts_expected)):
            with self.subTest(municipality = df_expected.iloc[idx]['Kommun']):        
                self.assertDictEqual(dicts_result[idx], dicts_expected[idx])
        
    def test_calculate_historical_change_percent(self):
        path_input_df = 'tests/reference_dataframes/df_paris.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_historical_change_percent.xlsx'
        
        df_input = get_df_from_excel(path_input_df) 
        df_result = calculate_historical_change_percent(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        
        pd.testing.assert_series_equal(df_result['historicalEmissionChangePercent'], df_expected['historicalEmissionChangePercent'])
                
    def test_calculate_needed_change_percent(self):
        path_input_df = 'tests/reference_dataframes/df_historical_change_percent.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_needed_change_percent.xlsx'
        
        df_input = get_df_from_excel(path_input_df) 
        df_result = calculate_needed_change_percent(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        
        pd.testing.assert_series_equal(df_result['neededEmissionChangePercent'], df_expected['neededEmissionChangePercent'])
        
    def test_calculate_hit_net_zero(self):
        path_input_df = 'tests/reference_dataframes/df_needed_change_percent.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_net_zero.xlsx'
        
        df_input = get_df_from_excel(path_input_df)
        df_result = calculate_hit_net_zero(df_input)
        df_expected = get_df_from_excel(path_expected_df)
    
        # Extract hit net zero dates and prepare for comparison (format to ISO YYYY-MM-DD)
        df_result['hitNetZero'] = [prep_date_str_for_compare(date) for date in df_result['hitNetZero']]
        df_expected['hitNetZero'] = [prep_date_str_for_compare(date) for date in df_expected['hitNetZero']]
        
        pd.testing.assert_series_equal(df_result['hitNetZero'], df_expected['hitNetZero'])

    def test_calculate_budget_runs_out(self):
        path_input_df = 'tests/reference_dataframes/df_net_zero.xlsx'
        path_expected_df = 'tests/reference_dataframes/df_budget_runs_out.xlsx'
            
        df_input = get_df_from_excel(path_input_df)
        df_result = calculate_budget_runs_out(df_input)
        df_expected = get_df_from_excel(path_expected_df)
        
        # Extract budget runs out dates and prepare for comparison (format to ISO YYYY-MM-DD)
        df_result['budgetRunsOut'] = [prep_date_str_for_compare(date) for date in df_result['budgetRunsOut']]
        df_expected['budgetRunsOut'] = [prep_date_str_for_compare(date) for date in df_expected['budgetRunsOut']]
        
        pd.testing.assert_series_equal(df_result['budgetRunsOut'], df_expected['budgetRunsOut'])

    def test_budget_runs_out_single_municipality_explicitly(self):
        # Sample DataFrame for municipality 'Ale'
        df_input = pd.DataFrame(
            {
                'Kommun': ['Ale'],
                "trend": [
                    {
                        2021: 140535.25077554,
                        2022: 142936.95388118387,
                        2023: 143719.28805910517,
                        2024: 144501.62223702623,
                        2025: 145283.9564149473,
                        2026: 146066.29059286858,
                        2027: 146848.62477078964,
                        2028: 147630.95894871093,
                        2029: 148413.293126632,
                        2030: 149195.6273045533,
                        2031: 149977.96148247435,
                        2032: 150760.2956603954,
                        2033: 151542.6298383167,
                        2034: 152324.96401623776,
                        2035: 153107.29819415906,
                        2036: 153889.63237208012,
                        2037: 154671.96655000118,
                        2038: 155454.30072792247,
                        2039: 156236.63490584353,
                        2040: 157018.96908376482,
                        2041: 157801.30326168588,
                        2042: 158583.63743960718,
                        2043: 159365.97161752824,
                        2044: 160148.3057954493,
                        2045: 160930.6399733706,
                        2046: 161712.97415129165,
                        2047: 162495.30832921294,
                        2048: 163277.642507134,
                        2049: 164059.97668505507,
                        2050: 164842.31086297636,
                    }
                ],
                "trendCoefficients": [[7.82334178e02, -1.43894275e06]],
                "Budget": [286595.380915185],
            }
        )
        
        df_result = calculate_budget_runs_out(df_input)
        result_date = df_result.iloc[0]['budgetRunsOut']
        
        expected_date = datetime.date(2025, 12, 22)

        self.assertEqual(result_date, expected_date)

if __name__ == '__main__':
    unittest.main()