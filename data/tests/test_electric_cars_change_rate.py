# -*- coding: utf-8 -*-
import datetime
import unittest
import pandas as pd

from solutions.cars.electric_car_change_rate import (
    get_electric_car_change_rate,
    clean_up_dataframe,
    get_filtered_result,
    get_change_yearly,
    get_change_percent,
    PATH_CARS_DATA
)

mock_data = {
}

class TestElectricCarsChangeRate(unittest.TestCase):

  def test_change_yearly(self):
    df = pd.read_excel(PATH_CARS_DATA)
    print(clean_up_dataframe(df))

    res = get_change_yearly(df)
    pass

  def test_change_percent(self):
    df = pd.read_excel(PATH_CARS_DATA)
    df = clean_up_dataframe(df)

    res = get_change_percent(df)
    pass

  def test_get_filtered_result(self):
    df = pd.read_excel(PATH_CARS_DATA)
    df = clean_up_dataframe(df)

    res = get_filtered_result(df)
    pass

  def test_get_electric_car_change_rate_with_data(self):
    df = pd.DataFrame({
        'Year': [2020, 2021, 2022],
        'Electric Cars': [100, 120, 150]
    })
    result = get_electric_car_change_rate(df)
    expected_result = pd.DataFrame({
        'Year': [2020, 2021, 2022],
        'Change Rate': [0.2, 0.25]
    })
    pd.testing.assert_frame_equal(result, expected_result)
