import unittest
import pandas as pd
from pandas.testing import assert_frame_equal

from facts.municipalities_counties import get_municipalities

PATH_MOCK_XLSX = 'kommunlankod_2023_mock.xlsx'

def mock_excel_file():
    df = pd.DataFrame({
        'Kod': [None, None, None, None, None, '01', '0101', '0102', '02', '0201'],
        'Namn': [None, None, None, None, None, 'County1', 'Municipality1', 'Municipality2', 'County2', 'Municipality3']
    })
    df.to_excel(PATH_MOCK_XLSX, index=False)

class TestGetMunicipalities(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        mock_excel_file()

    def test_get_municipalities(self):
        expected_df = pd.DataFrame({
            'Kommun': ['Municipality1', 'Municipality2', 'Municipality3'],
            'Kod': ['0101', '0102', '0201'],
            'Län': ['County1', 'County1', 'County2']
        })

        unique_types = expected_df['Kod'].apply(type).unique()
        print(unique_types)
        result = get_municipalities(PATH_MOCK_XLSX)
        print(result)
        print(expected_df)
        assert_frame_equal(expected_df, result)

if __name__ == '__main__':
    unittest.main()
