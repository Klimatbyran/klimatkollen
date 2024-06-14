import pandas as pd

# Read the Excel file into a DataFrame
df = pd.read_excel("companyData.xlsx")

# Replace commas and convert to float, handling errors
df['Scope 1'] = pd.to_numeric(df['Scope 1'].replace(',', '', regex=True), errors='coerce')
df['Scope 2 MB'] = pd.to_numeric(df['Scope 2 MB'].replace(',', '', regex=True), errors='coerce')
df['Scope 3'] = pd.to_numeric(df['Scope 3'].replace(',', '', regex=True), errors='coerce')

# Combine the Scope 1 and Scope 2 columns
df['Scope1n2'] = df['Scope 1'] + df['Scope 2 MB']

# Select the desired columns
selected_columns = ['report.companyName.keyword: Descending', 'Scope1n2', 'Scope 3']
selected_df = df[selected_columns]

# Strip leading and trailing whitespaces from all string columns
selected_df = selected_df.map(lambda x: x.strip() if isinstance(x, str) else x)

# Rename the columns for clarity
selected_df.columns = ['Company', 'Scope1n2', 'Scope3']

# Prefer null values to make it clear when data is missing
selected_df.replace('n.a', None, inplace=True)

# Write the DataFrame to a JSON file
selected_df.to_json("company-data.json", orient="records", force_ascii=False)

print('--- Company emissions data updated ---')
