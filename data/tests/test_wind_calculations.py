
import unittest
from data.solutions.wind.wind_calculations import get_municipality_by_coordinates


class TestWind(unittest.TestCase):

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


if __name__ == '__main__':
    unittest.main()
