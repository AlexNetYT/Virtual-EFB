from metar import Metar
from translate import Translator
from bs4 import BeautifulSoup
import requests
from datetime import datetime
global vat_spy_data
vat_spy_data = {}
with open('VATSpy.dat', 'r') as vat_spy_file:
    for line in vat_spy_file:
        icao, name, *_ = line.strip().split('|')
        vat_spy_data.update({icao:name})
def decode_metar(icao):
    global vat_spy_data
    try:
        #get metar 
        url = f"https://metartaf.ru/{icao.upper()}"
        page = requests.get(url)
        soup = BeautifulSoup(page.text, "html.parser")
        metar = soup.findAll('pre')
        metar_str = str(metar[0]).replace("<pre>","").replace("</pre>","").split("\n")[1]
        metar_str = "UUWW 192000Z 21009G16MPS 9999 -RA BKN016 09/07 Q0998 RMK WS R19 R19/290245 NOSIG"
        metar_report = Metar.Metar(metar_str)
        station_name = f"{icao.upper()} - {vat_spy_data[icao.upper()]}"
        weather_data = {
        'Airport': station_name,
        'Time of Observation': f"{metar_report.time.strftime('%H%M')}Z",
        'Wind': f"{round(metar_report.wind_dir._degrees)}° {metar_report.wind_speed.string().replace(' mps', 'MPS')} {''.join(['Gusts: ', str(metar_report.wind_gust)]) if metar_report.wind_gust != None else ''}",
        'Visibility': metar_report.visibility("M"),
        'Runway Visual Range': metar_report.runway_visual_range("M"),
        'Weather Phenomena': metar_report.present_weather(),
        'Sky Conditions': metar_report.sky_conditions(' | '),
        'Temperature': f"{round(metar_report.temp.value())}° {metar_report.temp._units}",
        'Dew Point': f"{round(metar_report.dewpt.value())}° {metar_report.dewpt._units}",
        'Altimeter':f"{round( metar_report.press.value())} {str(metar_report.press._units).replace('MB','hPa')}",
        
    }
        weather_data.update({'Remarks': f"{metar_report.remarks()}"}) if metar_report.remarks() != "" else None
        return weather_data
    except Metar.ParserError as e:
        return f"Error parsing METAR: {e}"

