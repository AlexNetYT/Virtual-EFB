import requests
import json, xmltodict
def get_simbrief_data(user_id):
    print(user_id)
    api_url = f'https://www.simbrief.com/api/xml.fetcher.php?userid={user_id}'
    print(api_url)
    try:
        response = requests.get(api_url)
        print(response)
        if response.status_code == 200:
            o = xmltodict.parse(response.text) 
            json_sb = json.dumps(o)
            js_sb = json.loads(json_sb)
            simbrief_out = js_sb
            del simbrief_out["OFP"]["origin"]["notam"]
            del simbrief_out["OFP"]["destination"]["notam"]
            del simbrief_out["OFP"]["alternate"]["notam"]
            del simbrief_out["OFP"]["notams"]
            with open("simbrief.txt", "w") as f:
                f.write(json.dumps(simbrief_out))
            return simbrief_out
        else:
            return None
    except Exception as e:
        print(f"Error: {str(e)}")
        return None

def compile_data(uid):
    dct = get_simbrief_data(uid)
    wunits = " " + json.loads(dct["OFP"]["api_params"]["acdata_parsed"])["wgtunits"]
    origin = dct["OFP"]["origin"]["icao_code"]
    destination = dct["OFP"]["destination"]["icao_code"]
    acType = dct["OFP"]["aircraft"]["name"]
    simbrief_id = dct["OFP"]["fetch"]["userid"]
    FL = "FL"+dct["OFP"]["atc"]["initial_alt"]
    fixes = []
    for fix in dct["OFP"]["navlog"]['fix']:
        fixes.append({
            "name": fix["name"],
            "ident": fix["ident"],
            "via": fix["via_airway"],
            "fuelPlanOnboard": fix["fuel_plan_onboard"],
            "altitude": fix["altitude_feet"],
        })
    load_sheet = {'block': dct["OFP"]['fuel']['plan_ramp']+wunits, 
                  'enroute': dct["OFP"]['fuel']['enroute_burn']+wunits,
                  'pax': dct["OFP"]['weights']['pax_count'],
                  'payload': dct["OFP"]['weights']['payload']+wunits,
                  'zfw': str(round(int(dct["OFP"]['weights']['est_zfw'])/1000, 1))+" T",
                  'tow': str(round(int(dct["OFP"]['weights']['est_tow'])/1000, 1))+" T"}
    return {
        "simbriefId": simbrief_id,
        "flightLevel": FL,
        "origin": origin,
        "destination": destination,
        "aircraftType": acType,
        "flightLevel": FL,
        "wunits": wunits,
        "fixes": fixes,
        "loadsheet": load_sheet
        }
    