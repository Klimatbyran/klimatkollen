# Climate Data Pipeline


## Climate Data Calculations

The script `climate_data_calculations.py` is a comprehensive data processing pipeline focused on the climate-related calculations and emissions analysis needed to obtain data presented at [klimatkollen.se](https://www.klimatkollen.se/). It imports functions from various modules to get data related to municipalities' climate plans, emissions, electric car change rates, and electric vehicle per charge points.

### Emission Calculations 

The module `emission_data_calculations.py` contains functions to perform calculations related to CO2 emissions for municipalities, based on SMHI emission data and a given total CO2 budget for Sweden. Each function serves a specific purpose such as preprocessing data, calculating municipality specific budgets, future trends or when the budget for a municipality will run out.

#### Constants 

The most important constants in the module are `BUDGET`, `BUDGET_YEAR`, and `LAST_YEAR_WITH_SMHI_DATA`, as they determine the baseline and scope of the calculations.

* `BUDGET`: Represents the total CO2 budget in metric tonnes.
* `BUDGET_YEAR`: Represents the year from which the CO2 budget applies.
* `LAST_YEAR_WITH_SMHI_DATA`: Represents the last year for which the [National Emission database](https://nationellaemissionsdatabasen.smhi.se/) has data.

#### Functions

Here's a summary of what the functions do, in order of execution:

* `get_n_prep_data_from_smhi`: Downloads data from SMHI and preprocess it into a pandas dataframe.
* `deduct_cement`: Deducts cement emissions from specified municipalities.
* `calculate_municipality_budgets`: Calculates municipality specific CO2 budgets derived from the SMHI data for each municipality and the given total CO2 budget.
* `calculate_trend`: Calculates linear trends for each municipality by using least square fit based on SMHI data from 2015 and forward.
* `calculate_paris_path`: Calculates an exponential curve satisfying each municipality's CO2 budget (Paris Agreement path), starting from the year when the budget kicks in.
* `calculate_change_percent`: Calculates the yearly decrease needed to reach the Paris Agreement goal.
* `calculate_hit_net_zero`: Calculates the date and year for when each municipality hits net zero emissions (if so). This, by deriving where the trend line crosses the time axis.

* `calculate_budget_runs_out`: Calculates the year and date for when the CO2 budget runs out for each municipality (if so). This, by integrating the trend line over the time it takes for the budget to be consumed and see where we are at the time axis by that point.

* `emission_calculations`: Orchestrates the execution of the above methods in sequence to perform all emission calculations for municipalities.




