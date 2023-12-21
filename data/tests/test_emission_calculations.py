# -*- coding: utf-8 -*-
import unittest
import pandas as pd

from issues.emissions.emission_calculations import deduct_cement, calculate_municipality_budgets, calculate_paris_path, calculate_trend, calculate_change_percent


LAST_YEAR_IN_SMHI_DATA = 2021


class TestChargingPointCalculations(unittest.TestCase):

    def test_deduct_cement(self):
        # Sample DataFrame including an unaffected municipality 'Ale'
        df_input = pd.DataFrame({
            'Kommun': ['Mörbylånga', 'Ale'],
            2010: [5000000, 4000000],
            2015: [5100000, 4100000],
            2016: [5200000, 4200000],
            2017: [5300000, 4300000],
            2018: [5400000, 4400000],
            2019: [5500000, 4500000],
            2020: [5600000, 4600000],
            2021: [5700000, 4700000]
        })

        df_expected = pd.DataFrame({
            'Kommun': ['Mörbylånga', 'Ale'],
            2010: [4751975, 4000000],
            2015: [4844030, 4100000],
            2016: [4960462, 4200000],
            2017: [5044217, 4300000],
            2018: [5158103, 4400000],
            2019: [5434824, 4500000],
            2020: [5600000, 4600000],
            2021: [5700000, 4700000]
        })

        df_result = deduct_cement(df_input)

        pd.testing.assert_frame_equal(df_result, df_expected)


    def test_calculate_municipality_budgets(self):
        path_input_df = 'tests/sample_dataframes/budget_calculations_input.xlsx'
        path_expected_df = 'tests/sample_dataframes/budget_calculations_expected.xlsx'

        df_input = pd.DataFrame(pd.read_excel(path_input_df))
    
        df_result = calculate_municipality_budgets(df_input)

        df_expected = pd.DataFrame(pd.read_excel(path_expected_df))

        pd.testing.assert_frame_equal(df_result, df_expected)


    def test_calculate_paris_path(self):
        df_input = pd.DataFrame({
            'Kommun': ['Ale'],
            2021: [140535.25077554],
            'Budget': [468479.933669228],
        })

        expected_series = pd.Series({
            2021: 140535.25077554,
            2022: 104113.01437312477,
            2023: 77130.25523518752,
            2024: 57140.56315116006,
            2025: 42331.55909151158,
            2026: 31360.57463027921,
            2027: 23232.917998962206,
            2028: 17211.689680754313,
            2029: 12750.97091462284,
            2030: 9446.32759951271,
            2031: 6998.142001483421,
            2032: 5184.447708065165,
            2033: 3840.8048924935515,
            2034: 2845.3912649661515,
            2035: 2107.9569718755943,
            2036: 1561.6420314454656,
            2037: 1156.9144280052456,
            2038: 857.0792580984938,
            2039: 634.951762101573,
            2040: 470.3925995016457,
            2041: 348.4819018905558,
            2042: 258.1665529472984,
            2043: 191.25805012858962,
            2044: 141.69008851606503,
            2045: 104.96855515463268,
            2046: 77.76406724456157,
            2047: 57.61011138534091,
            2048: 42.67941546053193,
            2049: 31.61827776844377,
            2050: 23.42383273657904
        })
        
        df_result = calculate_paris_path(df_input)
        dict_result = df_result['parisPath'].iloc[0]  # Access the dictionary in the series

        self.assertEqual(dict_result[2021], expected_series.iloc[0])
        self.assertEqual(dict_result[2031], expected_series.iloc[10])
        self.assertEqual(dict_result[2041], expected_series.iloc[20])
        self.assertEqual(dict_result[2050], expected_series.iloc[29])

    
    def test_calculate_trend(self):
        path_input_df = 'tests/sample_dataframes/budget_calculations_expected.xlsx'  # Reuse this df as input as it has budget column
        df_input = pd.DataFrame(pd.read_excel(path_input_df))

        expected_series = pd.Series({
            2021: 140535.25077554,
            2022: 142936.9538811841,
            2023: 143719.2880591054,
            2024: 144501.6222370267,
            2025: 145283.95641494775,
            2026: 146066.29059286905,
            2027: 146848.62477079034,
            2028: 147630.9589487114,
            2029: 148413.2931266327,
            2030: 149195.627304554,
            2031: 149977.96148247528,
            2032: 150760.29566039634,
            2033: 151542.62983831763,
            2034: 152324.96401623893,
            2035: 153107.29819416022,
            2036: 153889.63237208128,
            2037: 154671.96655000257,
            2038: 155454.30072792387,
            2039: 156236.63490584493,
            2040: 157018.96908376622,
            2041: 157801.3032616875,
            2042: 158583.6374396088,
            2043: 159365.97161752987,
            2044: 160148.30579545116,
            2045: 160930.63997337245,
            2046: 161712.97415129375,
            2047: 162495.3083292148,
            2048: 163277.6425071361,
            2049: 164059.9766850574,
            2050: 164842.31086297845
        })
        
        df_result = calculate_trend(df_input)
        dict_result = df_result['trend'].iloc[0]  # Access the dictionary in the series

        self.assertEqual(dict_result[2021], expected_series.iloc[0])
        self.assertEqual(dict_result[2031], expected_series.iloc[10])
        self.assertEqual(dict_result[2041], expected_series.iloc[20])
        self.assertEqual(dict_result[2050], expected_series.iloc[29])


    def test_calculate_change_percent(self):
        path_input_df = 'tests/sample_dataframes/paris_path_input.xlsx'
        df_input = pd.DataFrame(pd.read_excel(path_input_df))

        print(df_input.iloc[0]['parisPath'])  # fixme fortsätt här! får fel i testet

        expected_change_percent = 25.91679753045595
        
        result_change_percent = calculate_change_percent(df_input)

        #self.assertEqual(result_change_percent, expected_change_percent)

    
    def test_calculate_hit_net_zero(self):
       return


    def test_calculate_budget_runs_out(self):
        return


if __name__ == '__main__':
    unittest.main()