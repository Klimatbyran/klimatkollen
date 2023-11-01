
import unittest
import pandas as pd

from solutions.wind.wind_calculations import calculate_split_municipalities, determine_turbine_count_for_municipality, get_municipality_by_coordinates

class TestGetMunicipalityByCoordinates(unittest.TestCase):

    def test_get_municipality_by_coordinates(self):
        north = 6707005
        east = 567930
        municipality = get_municipality_by_coordinates(north, east)
        self.assertEqual(municipality, 'Hedemora',
                         'Incorrect municipality, shoud be Hedemora.')

    def test_get_municipality_by_coordinates_raises_error(self):
        north = 0
        east = 0

        with self.assertRaises(ValueError):
            get_municipality_by_coordinates(north, east)


class TestDeterminePowerCountForMunicipality(unittest.TestCase):

    def test_empty_dataframe(self):
        empty_df = pd.DataFrame()
        self.assertEqual(determine_turbine_count_for_municipality('SomeMunicipality', empty_df, 'SomeProject'), 0)

    def test_no_matching_rows(self):
        df = pd.DataFrame({
            'Projekteringsområde': ['Project1'],
            'N-Koordinat': [123],
            'E-Koordinat': [456],
            'Kommun': ['OtherMunicipality']
        })
        self.assertEqual(determine_turbine_count_for_municipality('SomeMunicipality', df, 'Project1'), 0)

    def test_matching_rows(self):
        df = pd.DataFrame({
            'Projekteringsområde': ['Project1', 'Project1', 'Project2'],
            'N-Koordinat': [123, 124, 125],
            'E-Koordinat': [456, 457, 458],
            'Kommun': ['SomeMunicipality', 'SomeMunicipality', 'OtherMunicipality']
        })
        self.assertEqual(determine_turbine_count_for_municipality('SomeMunicipality', df, 'Project1'), 2)


class TestCalculateSplitMunicipalities(unittest.TestCase):

    def test_empty_dataframe(self):
        empty_df = pd.DataFrame()
        source_df = pd.DataFrame()
        result = calculate_split_municipalities(empty_df, source_df)
        self.assertTrue(result.empty)

    def test_single_municipality(self):
        df = pd.DataFrame({
            'Kommun': ['SomeMunicipality'],
            'Projektnamn': ['Project1']
        })
        source_df = pd.DataFrame({
            'Projekteringsområde': ['Project1'],
            'N-Koordinat': [123],
            'E-Koordinat': [456],
            'Kommun': ['SomeMunicipality']
        })
        result = calculate_split_municipalities(df, source_df)
        self.assertEqual(result.iloc[0]['Kommun'], 'SomeMunicipality')
        self.assertEqual(result.iloc[0]['Antal verk i ursprunglig ansökan'], 1)

    def test_multiple_municipalities(self):
        df = pd.DataFrame({
            'Kommun': ['SomeMunicipality/OtherMunicipality'],
            'Projektnamn': ['Project1']
        })
        source_df = pd.DataFrame({
            'Projekteringsområde': ['Project1', 'Project1'],
            'N-Koordinat': [123, 124],
            'E-Koordinat': [456, 457],
            'Kommun': ['SomeMunicipality', 'OtherMunicipality']
        })
        result = calculate_split_municipalities(df, source_df)
        self.assertEqual(result.iloc[0]['Kommun'], 'SomeMunicipality')
        self.assertEqual(result.iloc[0]['Antal verk i ursprunglig ansökan'], 1)
        self.assertEqual(result.iloc[1]['Kommun'], 'OtherMunicipality')
        self.assertEqual(result.iloc[1]['Antal verk i ursprunglig ansökan'], 1)


if __name__ == '__main__':
    unittest.main()
