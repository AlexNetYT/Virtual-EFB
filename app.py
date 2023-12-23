from flask import Flask, render_template, jsonify
import socket
import datetime
import rich
import os, sys
from gevent.pywsgi import WSGIServer
import atexit
def exit_handler():
    print("Code to run before exiting")
    os.system(f"""start cmd /c Updater.exe {update_data[0].replace('"', '')} {update_data[1].replace('"', '')}""")  

port = 7325
host = socket.gethostbyname(socket.gethostname())
app = Flask(__name__)
import logging
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)
app.logger.disabled = True
log.disabled = True
app.json.sort_keys = False
static_folder = app.static_folder
# Your app configuration and any other global setup go here
import modules.autoupdate.module
update_data = modules.autoupdate.module.check_for_updates("AlexNetYT", "EFB-new")
if update_data is not None:
    
    if os.path.exists("Updater.exe"):
        atexit.register(exit_handler)

        
        sys.exit(0)
    else:
        rich.print(":bangbang: [bold]App [red]can not[/red] find [italic]Updater.exe[/italic] [/bold]:bangbang:")
        rich.print(":globe_with_meridians: [bold]You can download it here: [/bold][italic]https://github.com/AlexNetYT/EFB-new/releases/tag/Updater[/italic]")
        os.system("pause")
        sys.exit(0)
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
    http_server = WSGIServer((host, port), app, log=None)
    rich.print(f"[bold]App is running on [italic]http://{host}:{port}[/italic][/bold]")
    http_server.serve_forever()
http_server.stop()
