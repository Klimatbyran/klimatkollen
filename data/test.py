import json
import traceback

def validate_output():
	data = None
	with open('output/climate-data.json', 'r', encoding='utf8') as json_file:  
	    data = json.load(json_file)

	try:
		run_tests(data)
		return True
	except AssertionError as e:
		print(e)
		print(traceback.format_exc())
		return False
	
def run_tests(data):
	assert len(data) == 290, "290 communs"

	for munip in data:
		totals = munip['emissions']
		for year in totals:
			assert totals[year] >= 0, [munip['kommun'], year, totals[year]]

		computedTotals = dict()
		sectors = munip['sectorEmissions']
		for name in sectors:
			sector = sectors[name]
			for year in sectors[name]:
				assert sector[year] >= 0, ["Nonnegative total sectors", munip['kommun'], year, sector[year]]

				if year not in computedTotals:
					computedTotals[year] = 0
				computedTotals[year] = computedTotals[year] + sector[year]
				
		for year in totals:
			assert abs(totals[year]-computedTotals[year]) < 0.005, ["Sectors sum up", year, munip['kommun']]

if __name__ == "__main__":
	print("PASSED" if validate_output() else "FAILED")
    
