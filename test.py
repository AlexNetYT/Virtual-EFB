import requests
from bs4 import BeautifulSoup
icao = "URSS"
url = f'https://vatrus.info/airport/{icao}'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'lxml')
quotes  = soup.find("table", class_='text-center table table-sm table-striped table-responsive-lg')
items = quotes.find_all("th")
output = {}
for item in items:
    string = str(item)
    runway = item.text
    if "row" in string:
      output.update({runway: 'https://metar-taf.com/images/rwy/day-{str(runway.split("/")[0]).replace("0", "")}.svg'})
