import httpx
import json, xmltodict
import datetime
import requests
from bs4 import BeautifulSoup

def get_simbrief_data(user_id):
    print(user_id)
    api_url = f'https://www.simbrief.com/api/xml.fetcher.php?userid={user_id}'
    print(api_url)
    try:
        response = httpx.get(api_url)
        print(response)
        if response.status_code == 200 or response.status_code == 400:
            o = xmltodict.parse(response.text) 
            json_sb = json.dumps(o)
            js_sb = json.loads(json_sb)
            if js_sb["OFP"]["fetch"]["status"] == 'Success':
                simbrief_out = js_sb
                if simbrief_out["OFP"]["fetch"]["userid"] == user_id:
                    del simbrief_out["OFP"]["origin"]["notam"]
                    del simbrief_out["OFP"]["destination"]["notam"]
                    del simbrief_out["OFP"]["alternate"]["notam"]
                    del simbrief_out["OFP"]["notams"]
                    return simbrief_out, "OK"
                else:
                    return None, f"Simbrief Error|Simbrief id doesn't match"
            else: return None, f"Simbrief Error|{js_sb["OFP"]["fetch"]["status"]}"
        else:
            return None, f"Simbrief Error|Simbrief returned {response.status_code} code"
    except Exception as e:
        print(f"Error: {str(e)}")
        return None, f"Server Error|{e}"

def compile_data(uid):
    dct, status = get_simbrief_data(uid)
    if status == "OK":
        wunits = " "+dct["OFP"]["params"]["units"]
        origin = dct["OFP"]["origin"]["icao_code"]
        destination = dct["OFP"]["destination"]["icao_code"]
        simbrief_id = dct["OFP"]["fetch"]["userid"]
        fixes = []
        for fix in dct["OFP"]["navlog"]['fix']:
            waypoint_text = f"{fix["name"]} - {fix["ident"]}\nVia airway - {fix['via_airway']}\nEFOB - {fix['fuel_plan_onboard']}\nFlight at {fix['altitude_feet']} feet"
            fixes.append({
                "name": fix["name"],
                "ident": fix["ident"],
                "via": fix["via_airway"],
                "fuelPlanOnboard": fix["fuel_plan_onboard"],
                "altitude": fix["altitude_feet"],
                "lat": fix["pos_lat"],
                "long": fix['pos_long'],
                "text": waypoint_text
            })
        # fixes.reverse()
        mach = "MACH: 0"+dct["OFP"]["general"]["cruise_mach"]
        arr_time = f'BLOCK: {str(datetime.timedelta(minutes=round(int(dct["OFP"]["times"]["est_block"])/60)))[:-3]}'
        dep_time = f'AIR: {str(datetime.timedelta(minutes=round(int(dct["OFP"]["times"]["est_time_enroute"])/60)))[:-3]}'
        dist = "DIST: "+dct["OFP"]["general"]["route_distance"]+" NM"
        map = f"https://www.simbrief.com/ofp/uads/{dct['OFP']['images']['map'][0]['link']}"
        vp = f"https://www.simbrief.com/ofp/uads/{dct['OFP']['images']['map'][-1]['link']}"
        pdf = f"https://www.simbrief.com/ofp/uads/{dct['OFP']['files']['pdf']['link']}"
        load_sheet = {'block': dct["OFP"]['fuel']['plan_ramp']+wunits, 
                    'enroute': dct["OFP"]['fuel']['enroute_burn']+wunits,
                    'pax': dct["OFP"]['weights']['pax_count'],
                    'payload': dct["OFP"]['weights']['payload']+wunits,
                    'zfw': str(round(int(dct["OFP"]['weights']['est_zfw'])/1000, 1))+" T",
                    'tow': str(round(int(dct["OFP"]['weights']['est_tow'])/1000, 1))+" T"}
        return {
            "status": status,
            "simbriefId": simbrief_id,
            "origin": origin,
            "dep_time": dep_time,
            "arr_time": arr_time,
            "distance": dist,
            "mach": mach,
            "destination": destination,
            "wunits": wunits,
            "fixes": fixes,
            "loadsheet": load_sheet,
            "map": map,
            "vertprof": vp,
            "pdf": pdf,
            }
    else: return {"status": status}