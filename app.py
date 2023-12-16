from flask import Flask, render_template, jsonify
import socket
import datetime
host = socket.gethostbyname(socket.gethostname())
app = Flask(__name__)
app.json.sort_keys = False
static_folder = app.static_folder
# Your app configuration and any other global setup go here

# Import and register blueprints/modules
from modules.pdf_viewer import pdf_viewer_bp
app.register_blueprint(pdf_viewer_bp, url_prefix='/pdf_viewer')
from modules.weather.views import weather_blueprint
app.register_blueprint(weather_blueprint, url_prefix='/weather')
from modules.ofp.views import ofp_bp
app.register_blueprint(ofp_bp, url_prefix='/ofp')
@app.route('/')
def pdf_viewer_index():
    return render_template('main_page.html')
@app.route("/get_current_time")
def get_current_time():
    return jsonify(datetime.datetime.now().strftime('LT: %Y-%m-%d %H:%M:%S'))
@app.route("/get_current_time_utc")
def get_current_time_utc():
    return jsonify(datetime.datetime.utcnow().strftime('UTC: %Y-%m-%d %H:%M:%S'))

if __name__ == '__main__':
    app.run(debug=True, host=host)
