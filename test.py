import requests

def get_runways(icao):
  # API URL
  url = f"https://v4p4sz5ijk.execute-api.us-east-1.amazonaws.com/anbdata/airports/locations/documentations?api_key=3f0c8a9f-7c48-11eb-8e3e-6f2f9cf8b334&airports={icao}&format=json"
  # Send request and get response
  response = requests.get(url)
  # Check status code
  if response.status_code == 200:
    # Parse JSON data
    data = response.json()
    # Get runways data
    runways = data[0]["runways"]
    # Initialize output list
    output = []
    # Loop through runways
    for runway in runways:
      # Get runway number and course
      number = runway["runwayNumber"]
      course = runway["runwayCourse"]
      # Create dictionary with number and course
      runway_dict = {number: course}
      # Append to output list
      output.append(runway_dict)
    # Return output list
    return output
  else:
    # Return error message
    return f"Error: {response.status_code}"

print(get_runways("UMMS"))