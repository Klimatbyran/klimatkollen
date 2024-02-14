# Climate Data Pipeline


## climate_data_calculations.py

This script is a comprehensive data processing pipeline focused on the climate-related calculations and emissions analysis needed to obtain data presented at [klimatkollen.se](https://www.klimatkollen.se/). It imports functions from various modules to get data related to municipalities' climate plans, emissions, electric car change rates, electric vehicle per charge points, and consumption emissions.

### emission_data_calculations.py

This module contains functions to perform various calculations related to CO2 emissions for municipalities, based on a given total CO2 budget for Sweden. Each function serves a specific purpose such as preprocessing data, calculating municipality specific budgets, trends or when the budget for a municipality will run out.

#### Constants 

The most important constants in the module are `BUDGET`, `BUDGET_YEAR`, and `LAST_YEAR_WITH_SMHI_DATA`, as they determine the baseline and scope of the calculations.

* `BUDGET`: Represents the total CO2 budget in metric tonnes.
* `BUDGET_YEAR`: Represents the year from which the CO2 budget applies.
* `LAST_YEAR_WITH_SMHI_DATA`: Represents the last year for which the [National Emission database](https://nationellaemissionsdatabasen.smhi.se/) has data.

#### Functions

Here's a summary of what the functions do, in order of execution:

* `get_n_prep_data_from_smhi`: Downloads data from SMHI and preprocess it into a pandas dataframe.
* `deduct_cement`: Deducts cement emissions from specified municipalities.
* `calculate_municipality_budgets`: Calculates municipality specific CO2 budgets based on a budget share derived from the SMHI data for each municipality.
* `calculate_trend`: Calculates linear trends for each municipality based on SMHI data.
* `calculate_paris_path`: Calculates an exponential curve satisfying each municipality's CO2 budget (Paris Agreement path).
* `calculate_change_percent`: Calculates the yearly decrease needed to reach the Paris Agreement goal.
* `calculate_hit_net_zero`: Calculates the date and year each municipality hits net zero emissions (if so).
* `calculate_budget_runs_out`: Calculates the year the CO2 budget runs out for each municipality (if so).
* `emission_calculations`: Orchestrates the execution of the above methods in sequence to perform all emission calculations for municipalities.




