import xmltodict, datetime
import re

def convert_coordinates(coord_str):
    # Разбиваем строку на части
        # Используем регулярные выражения для извлечения числовых значений
    lat_match = re.search(r'(\d+)° (\d+)\' (\d+\.\d+)"', coord_str)
    lon_match = re.search(r'(\d+)° (\d+)\' (\d+\.\d+)"', coord_str.split(',')[1])

    if not lat_match or not lon_match:
        
        raise ValueError("Некорректный формат координат")

    # Извлекаем значения градусов, минут и секунд
    lat_deg, lat_min, lat_sec = map(float, lat_match.groups())
    lon_deg, lon_min, lon_sec = map(float, lon_match.groups())

    # Переводим в десятичный формат
    latitude = lat_deg + lat_min/60 + lat_sec/3600
    longitude = lon_deg + lon_min/60 + lon_sec/3600

    # Добавляем знак "+" перед долготой
    if coord_str.split(',')[1].startswith('W'):
        longitude = -longitude

    return latitude, longitude

def compile_data(text_fo_pln):
    dct = xmltodict.parse(text_fo_pln[:3])
    origin = dct["SimBase.Document"]["FlightPlan.FlightPlan"]["DepartureID"]
    destination = dct["SimBase.Document"]["FlightPlan.FlightPlan"]["DestinationID"]
    f = open("readed.txt", "a")
    fixes = []
    for fix in dct["SimBase.Document"]["FlightPlan.FlightPlan"]['ATCWaypoint']:
        cords = convert_coordinates(fix["WorldPosition"].replace("В", ""))
        try:
            waypoint_text = f"{fix["ATCWaypointType"]} - {fix["@id"]}\nVia airway - {fix['ATCAirway']}"
            fixes.append({
            "name": fix["@id"],
            "ident": fix["@id"],
            "via": fix["ATCAirway"],
            "lat": cords[0],
            "long": cords[1],
            "text": waypoint_text
        })
        except:
            waypoint_text = f"{fix["ATCWaypointType"]} - {fix["@id"]}"
            fixes.append({
            "name": fix["@id"],
            "ident": fix["@id"],
            "via": "",
            "lat": cords[0],
            "long": cords[1],
            "text": waypoint_text
        })
        

        
        
    return {
        "origin": origin,
        "destination": destination,
        "fixes": fixes,
        }