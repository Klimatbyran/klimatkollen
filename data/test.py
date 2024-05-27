import json
import traceback

def validate_output():
    """
    Validates the output by loading the climate data from 'output/climate-data.json'
    and running tests on the data.

    Returns:
          bool: True if the tests pass, False otherwise.
    """

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
    """
    Run tests on the given data to ensure data integrity.

    Args:
        data (list): A list of dictionaries representing municipality data.

    Raises:
        AssertionError: If any of the tests fail.
    """

    assert len(data) == 290, "290 municipalities"

    for municipality in data:
        totals = municipality['emissions']
        for year in totals:
            assert totals[year] >= 0, [municipality['kommun'], year, totals[year]]

        if sectors := municipality['sectorEmissions']:
            computed_totals = {}
            for name in sectors:
								# FIXME this needs to be rewritten to suit new data structure
                sector = sectors[name]
                for year in sector:
                    assert sector[year] >= 0, ["Nonnegative total sectors", municipality['kommun'], year, sector[year], name]
                    if year not in computed_totals:
                        computed_totals[year] = 0
                    computed_totals[year] = computed_totals[year] + sector[year]

            for year in totals:
                assert abs(totals[year]-computed_totals[year]) < 0.005, ["Sectors sum up", year, municipality['kommun']]

if __name__ == "__main__":
    print("PASSED" if validate_output() else "FAILED")
