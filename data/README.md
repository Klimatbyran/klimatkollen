# Climate Data Pipeline Overview

## General information

### Data Sources

We obtain our information from multiple providers including SMHI, SCB, Trafa, and PowerCircle. Some of this information is stored directly in our repository, while other datasets are dynamically pulled from their original locations.

### Data Transformation

We utilize Python libraries such as Pandas and NumPy to perform various calculations on the collected data. This allows us to tailor the data into a format that is easier to understand and display on our website.

### Repository Structure

- `/data:` This directory contains both the datasets we host and the Python scripts for calculations.
    - `climate_data_calculations.py`: Execute this Python script to run all the calculations and generate updated data.
- `/data/output:` This is where the processed data gets saved.
    - `climate-data.json`: This JSON file serves as the core output, containing all the calculated climate data.
- `/data/tests:` Unit tests for data calculations. To run a specific test file, stand in `/data/` and run

    ```
    python3 -m unittest tests/{filename}.py
    ```

    where you replace *filename* with the name of the actual test file.

### How to Update Data on Site

To recalculate and refresh the site's data, navigate to the `/data` folder and execute the following command:

`python3 climate_data_calculations.py`

The results will be saved in the `/data/output` folder, primarily in the `climate-data.json` file. The climate data is sourced using a TypeScript utility service located at `utils/climateDataService.tsx`. This service is responsible for fetching and manipulating the data found in `climate-data.json` for use throughout the website. To add or edit the descriptions of datasets that appear in the national overview on the website's homepage, make the necessary changes in `utils/datasetDescriptions.tsx`.

#### Handling Data Inconsistencies for Municipalities

Given that Klimatkollen focuses on data related to municipalities, it's often necessary to standardize the naming conventions for Swedish municipalities as they can vary across different datasets. The following are known cases:

- Falun: also called Falu kommun.
- Gotland: also called Region Gotland or Region Gotland (kommun).
- Upplands Väsby: alternate spelling includes Upplands-Väsby.
- Stockholm: also called Stockholms stad.
- Malmö: also called Malmö stad.

In the list, the term appearing before the colon (:) is the standardized name that we use in the repository. Any alternative names listed after "also known as" should be converted to this standard version when incorporating new data sets.

## Detailed explanations

### Emission Calculations 

The module `emission_data_calculations.py` contains functions to perform calculations related to CO2 emissions for municipalities, based on SMHI emission data and a given total CO2 budget for Sweden. Each function serves a specific purpose such as preprocessing data, calculating municipality specific budgets, future trends or when the budget for a municipality will run out.

#### Constants 

The most important constants in the module are `BUDGET`, `BUDGET_YEAR`, and `LAST_YEAR_WITH_SMHI_DATA`, as they determine the baseline and scope of the calculations.

* `BUDGET`: Represents the total CO2 budget in metric tonnes.
* `BUDGET_YEAR`: Represents the year from which the CO2 budget applies.
* `LAST_YEAR_WITH_SMHI_DATA`: Represents the last year for which the [National Emission database](https://nationellaemissionsdatabasen.smhi.se/) has data.

#### Functions

Here's a summary of what the functions do, in order of execution:

1. `get_n_prep_data_from_smhi`: Downloads data from SMHI and preprocess it into a pandas dataframe.

2. `deduct_cement`: Deducts cement emissions from specified municipalities.

3. `calculate_municipality_budgets`: Calculates municipality specific CO2 budgets by deriving budget shares from the SMHI data for each municipality (using grand fathering) and multiplying them with the given total CO2 budget.

4. `calculate_trend`: Calculates linear trends for each municipality by using least square fit based on SMHI data from 2015 and forward.

5. `calculate_paris_path`: Calculates an exponential curve satisfying each municipality's CO2 budget (Paris Agreement path), starting from the year the budget kicks in.

6. `calculate_change_percent`: Calculates the yearly decrease in percent needed to reach the Paris Agreement goal.

7. `calculate_hit_net_zero`: Calculates the date and year for when each municipality hits net zero emissions (if so). This, by deriving where the trend line crosses the time axis.

8. `calculate_budget_runs_out`: Calculates the year and date for when the CO2 budget runs out for each municipality (if so). This, by integrating the trend line over the time it takes for the budget to be consumed and see where we are at the time axis by that point.

9. `emission_calculations`: Orchestrates the execution of the above methods in sequence to perform all emission calculations for municipalities.




