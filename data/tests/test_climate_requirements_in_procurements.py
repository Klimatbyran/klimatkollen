# -*- coding: utf-8 -*-
import unittest
import pandas as pd

from facts.procurements.climate_requirements_in_procurements import (
    calculate_procurement_score,
)


class TestProcurementCalculations(unittest.TestCase):
    
    def test_calculate_procurement_score(self):
        # Sample data frame for cleaned Greenpeace data
        df_cleaned_greenpeace_input = pd.DataFrame(
            {
                "Kommun": ["Ale", "Alingsås", "Bräcke"],
                "procurementLink": ["https://drive.google.com/file/d/1x27RSR7W9aNADMMXb5BQyeVPViE00CpT/view?usp=drive_link", "", ""],
            }
        )
        
        # Sample data frame for NUR data
        df_cleaned_nur_input = pd.DataFrame(
            {
                
                "Kommun": ["Ale", "Alingsås", "Bräcke"],
                "BINÄRT_UTFALL": [0, 0, 1],
            }
        )

        df_expected = pd.DataFrame(
            {
                "Kommun": ["Ale", "Alingsås", "Bräcke"],
                "procurementLink": ["https://drive.google.com/file/d/1x27RSR7W9aNADMMXb5BQyeVPViE00CpT/view?usp=drive_link", "", ""],
                "procurementScore": [2, 0, 1],
            }
        )

        df_result = calculate_procurement_score(df_cleaned_greenpeace_input, df_cleaned_nur_input)
        pd.testing.assert_frame_equal(df_result, df_expected)

if __name__ == "__main__":
    unittest.main()
