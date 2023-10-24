import pandas as pd

# Read the data
df = pd.read_excel('wind_data.xlsx')

# Filter out rows with "År slutligt beslut" 2014 or earlier
df = df[df['År slutligt beslut'] > 2014]

# Filter out rows with "Kommun" containing '/', ie rows with two municipalities and filter relevant columns
df_two_municipalities = df[df['Kommun'].str.contains('/')][['Kommun', 'Antal verk i ursprunglig ansökan',
                                             'Antal verk som ej fått tillstånd pga veto']].reset_index(drop=True)

rows = []
for _, row in df_two_municipalities.iterrows():
    municipalities = row['Kommun'].split('/')
    for municipality in municipalities:
        rows.append({
            'Kommun': municipality.strip(),
            'Antal verk i ursprunglig ansökan': row['Antal verk i ursprunglig ansökan'] / len(municipalities),
            'Antal verk som ej fått tillstånd pga veto': row['Antal verk som ej fått tillstånd pga veto'] / len(municipalities)
        })

df_split = pd.DataFrame(rows)

# Remove rows with two municipalities from the original df
df = df[~df['Kommun'].str.contains('/')].reset_index(drop=True)

concat_df = pd.concat([df, df_split])
merged_sum_df = concat_df.groupby('Kommun', sort=True).sum().reset_index()

# Group by 'Kommun' and sum the numeric columns
grouped = merged_sum_df.groupby('Kommun').sum().reset_index()

# Calculate the 'Nekat' columns
grouped['Nekade'] = (grouped['Antal verk som ej fått tillstånd pga veto'] /
                     grouped['Antal verk i ursprunglig ansökan'])*100

# Select only the columns 'Kommun', and 'Nekat'
output_df = grouped[['Kommun', 'Nekade']]

# Write the new DataFrame to an xlsx file
output_df.to_excel('wind_output.xlsx', index=False)
