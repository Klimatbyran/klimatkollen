import argparse
from datetime import datetime
from getpass import getuser
import json
import os
import pandas as pd

def process_json_files(folder_path = 'data/trafa/downloads', output_file= 'data/output/trafa-output.xlsx'):
    # Specify the folder path where the JSON files are located

    column_names = { 
        'ar': 'År',
        'regkom': 'Kommun', # type: ignore
        'nyregunder_El': 'Elbilar ',
        'nyregunder_Laddhybrid': 'Laddhybrider ',
        'totalt': 'Totalt laddbara bilar ',
    }
    # Get a list of all JSON files in the folder
    json_files = [file for file in os.listdir(folder_path) if file.endswith('.json')]

    # Create a new Excel writer object

    writer = pd.ExcelWriter(output_file)

    # Iterate over each JSON file
    for file in json_files:
        # Read the JSON file into a DataFrame
        with open(os.path.join(folder_path, file)) as f:
            data = json.load(f)
            print(f"Processing {file}...")
        rows_data = data['Rows']
# Personbilar-2015.json 
        # Extract the year from the file name
        year = int(file.split('-')[1].split('.')[0])
        print(year)
        # Create a list to hold the data
        data_list = []
        # Iterate over each row
        for row in rows_data:
            # Extract the data under the "Cell" key
            cell_data = row['Cell']
            
            # Create a dictionary to hold the row data
            row_dict = {}
            
            # Iterate over each cell
            for cell in cell_data:
                # Add the cell data to the row dictionary as numeric values
                row_dict[cell['Column']] = cell['Value']
            # Add the row dictionary to the data list
            data_list.append(row_dict)

        # Convert the data list to a DataFrame
        json_data = pd.DataFrame(data_list)
        # Pivot the DataFrame
        pivot_data = json_data.pivot_table(index=['regkom'], columns='drivmedel', values=['nyregunder'], aggfunc='first') # type: ignore

        # Flatten the MultiIndex columns
        pivot_data.columns = ['_'.join(col).strip() for col in pivot_data.columns.values]
        
        # Reset the index to make 'ar' and 'regkom' regular columns
        pivot_data.fillna(0, inplace=True)
        pivot_data = pivot_data.reset_index()
        
        # add column 'totalt' to the DataFrame by summing the values of 'Elbilar' and 'Laddhybrider'
        pivot_data['totalt'] = pivot_data.apply(lambda row: int(row['nyregunder_El'] or 0) + int(row['nyregunder_Laddhybrid'] or 0), axis=1)
    
        pivot_data = pivot_data.rename(columns=lambda x: f"{column_names[x]}{year}" if x in column_names and x != 'regkom' else column_names["regkom"] if x == 'regkom' else x)
        
    
        
        
        # Add a row to the DataFrame with the total values
        

        
        
        
        print(pivot_data)
        # Write the DataFrame to a new sheet in the Excel file
        pivot_data.to_excel(writer, sheet_name=os.path.splitext(file)[0], index=False)
        

    # Save the Excel file
    writer.close()
    print(f"Data successfully transformed and saved to {output_file}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--function", help="The function to run")
    parser.add_argument("--json-data", help="The JSON data to process")
    args = parser.parse_args()

    if args.function == "process_json_files":
        process_json_files()

