import pandas as pd

# Read the Excel file into a DataFrame
df = pd.read_excel("companyData.xlsx", sheet_name="SiteData")

# Select the desired columns
selected_columns = ['Company', 'URL 2023', 'Scope 1+2', 'Scope 3 (total)', 'Alex kommentar']
selected_df = df[selected_columns]

# Rename the columns for clarity
selected_df.columns = ['Company', 'URL', 'Scope1n2', 'Scope3', 'Comment']

# Write the DataFrame to a JSON file
selected_df.to_json("company-data.json", orient="records")
