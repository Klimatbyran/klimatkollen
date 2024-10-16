import pandas as pd

# Read the Excel file into a DataFrame
df = pd.read_excel("companyData.xlsx", sheet_name="SiteData")

# Select the desired columns
selected_columns = ['Company', 'Wiki id', 'URL 2023', 'Scope 1+2', 'Scope 3 (total)', 'Alex kommentar']
selected_df = df[selected_columns]

# Strip leading and trailing whitespaces from all string columns
selected_df = selected_df.map(lambda x: x.strip() if isinstance(x, str) else x)

# Rename the columns for clarity
selected_df.columns = ['Company', 'WikiId', 'URL', 'Scope1n2', 'Scope3', 'Comment']

# Prefer null values to make it clear when data is missing
selected_df.replace('n.a', None, inplace=True)

# Write the DataFrame to a JSON file
selected_df.to_json("company-data.json", orient="records", force_ascii=False)

print('--- Company emissions data updated ---')
