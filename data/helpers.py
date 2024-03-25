import re


MUNICIPALITIES_W_S = ['Alingsås kommun', 'Bengtsfors kommun', 'Bollnäs kommun', 'Borås stad',
                      'Degerfors kommun', 'Grums kommun', 'Hagfors kommun', 'Hofors kommun',
                      'Hällefors kommun', 'Höganäs kommun', 'Kramfors kommun', 'Munkfors kommun',
                      'Mönsterås kommun', 'Robertsfors kommun', 'Sotenäs kommun', 'Storfors kommun',
                      'Strängnäs kommun', 'Torsås kommun', 'Tranås kommun', 'Vännäs kommun', 'Västerås stad']


def clean_kommun(kommun):
    """
    Clean the municipality name by removing whitespace and specific keywords.
  
    Args:
      kommun (str): The municipality name to be cleaned.
  
    Returns:
      str: The cleaned municipality name.
    """

    # Remove any whitespace
    kommun = kommun.strip()

    # Replace 'Falu kommun' with 'Falun'
    if kommun == 'Falu kommun':
        return 'Falun'

    if kommun == 'Region Gotland (kommun)':
        return 'Gotland'

    # Remove 'kommun' or 'stad' from municipalities in the list 'municipalities_w_s'
    if kommun in MUNICIPALITIES_W_S:
        kommun = re.sub(r'( kommun| stad)', '', kommun)

    # Remove 'kommun', 'stad', 's kommun', or 's stad' from all other municipalities
    kommun = re.sub(r'( kommun| stad|s kommun|s stad)', '', kommun)

    return kommun
