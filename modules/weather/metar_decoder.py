from metar import Metar
import json, requests
global vat_spy_data
vat_spy_data = {}

def decode_metar(icao):
    global vat_spy_data
    icao=icao.upper()
    try:
        #get metar 
        response = requests.request("GET", f"http://metartaf.ru/{icao}.json")
        metar_dct = response.json()
        metar_str = metar_dct['metar'][20:]
        metar_report = Metar.Metar(metar_str)
        sky_cond = metar_report.sky_conditions('|')
        sky = sky_cond.split('|') if len(metar_report.sky_conditions('|').split('|')) > 1 else sky_cond
        weather_data = {
        '🗼Airport': metar_dct['name'],
        '🕒Time of Observation': f"{metar_report.time.strftime('%H%M')}Z",
        '💨Wind': f"{round(metar_report.wind_dir._degrees)}° {metar_report.wind_speed.string().replace(' mps', 'MPS')} {''.join(['Gusts: ', str(metar_report.wind_gust)]) if metar_report.wind_gust != None else ''}",
        '👁️Visibility': metar_report.visibility("M"),
        
        '🛰️Weather Phenomena': metar_report.present_weather(),
        '🌡️Temperature': f"{round(metar_report.temp.value())}° {metar_report.temp._units}",
        '🌫️Dew Point': f"{round(metar_report.dewpt.value())}° {metar_report.dewpt._units}",
        '⏱️Altimeter':f"{round( metar_report.press.value())} {str(metar_report.press._units).replace('MB','hPa')}",
        
    }
        
        for item in sky:
            type, alt = item.split(" at ")
            weather_data.update({"☁️"+type.capitalize(): alt})

        weather_data.update({'Remarks': f"{metar_report.remarks()}"}) if metar_report.remarks() != "" else None
        weather_data.update({'🛫Runway Visual Range': metar_report.runway_visual_range("M")}) if metar_report.runway_visual_range("M") != "" else None
        return weather_data
    except Metar.ParserError as e:
        return f"Error parsing METAR: {e}"
    
print(decode_metar("urss"))