from flask import render_template, Blueprint, jsonify
from . import metar_decoder
weather_blueprint = Blueprint('weather', __name__)

@weather_blueprint.route('/')
def weather_index():
    return render_template('weather.html')

@weather_blueprint.route('/get_weather_info/<icao_code>')
def get_weather_info(icao_code):
    # Placeholder data for demonstration purposes
    weather_data = metar_decoder.decode_metar(icao_code)

    return jsonify(weather_data)

@weather_blueprint.route("/get_runways/<icao>", methods=["GET"])
def get_runways(icao):
    runways = metar_decoder.get_runways(icao=icao.upper())
    print(runways)
    return jsonify(runways)

@weather_blueprint.route('/?=<ICAO>')
def render_with_weather(ICAO):
    print(ICAO)
    return render_template('weather.html')