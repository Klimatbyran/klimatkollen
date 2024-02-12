## Klimatkollen

This is the official source code for [klimatkollen.se](https://klimatkollen.se).

## About

Free our climate data! Klimatkollen is an open source and citizen-driven climate data platform aimed at visualising local climate data.

<b>The</b> problem: Most of Sweden’s 290 cities and municipalities are not slashing carbon emissions fast enough to be in line with the Paris Agreement. Furthermore, climate data that can help us is often locked behind paywalls or sits in complex government databases. If we can’t clearly see how much CO2 is being emitted, from which sources and how quickly we need to decarbonise – we can’t create a public opinion strong enough to change the course of our future.

This needs to change.

That’s why we’re building a data-driven movement of climate-savvy developers to help us find and visualise climate data for the public.

Please climb onboard to help us set our climate data free! #Klimatkollen /#FreeClimateData

## Get started

We use next.js and Typescript and it's pretty straightforward to get started. Just clone the repo and run:

    npm ci
    npm run dev

This opens up a webserver on http://localhost:3000. Just edit the code and see the live refresh.

## Contribute

The idea behind Klimatkollen is to give citizens access to the climate data we need to meet the goals of the Paris Agreement – and save our own future.

Do you have an idea for a feature you think should be added to the project? Please develop it and create a pull request where you explain what you've done. If you can't develop the feature yourself, please submit an [issue](https://github.com/Klimatbyran/klimatkollen/issues) where you explain your suggestion.

Looking for ideas on what needs to be done? Take a look at our [issues](https://github.com/Klimatbyran/klimatkollen/issues) and/or [pull requests](https://github.com/Klimatbyran/klimatkollen/pulls). Testing, bug fixes, typos or fact checking our data is highly appreciated.

Feedback? Either submit an [issue](https://github.com/Klimatbyran/klimatkollen/issues) or send an email to [hej@klimatkollen.se](mailto:hej@klimatkollen.se).

Please star this repo if you want to follow the progress and feel free to join our [Discord](https://discord.gg/N5P64QPQ6v).

## Climate Data Pipeline Overview

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

Feel free to explore the repository to understand more about how we collect, process, and display climate data.

## Supporters and Partners

This work wouldn't have been possible without the support from

Google.org, Postkodstiftelsen.

We'd also like to thank our current and former partners

ClimateView, Klimatklubben.se, Researcher's Desk, Exponential Roadmap, WWF, We Don't Have Time, Våra Barns Klimat, Argand, StormGeo, Iteam, Precisit.

## LICENSE

MIT Copyright (c) Klimatbyrån
