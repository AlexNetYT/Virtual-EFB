from flask import Flask, render_template, jsonify
import socket
import datetime
import rich
import webbrowser
import os, sys
from gevent.pywsgi import WSGIServer
import atexit
import threading
from pystray import MenuItem as item
import pystray
from PIL import Image
def exit_handler():
    print("Code to run before exiting")
    os.system(f"""start cmd /c Updater.exe {update_data[0].replace('"', '')} {update_data[1].replace('"', '')}""")  
Log_flag = 1
port = 7325
host = socket.gethostbyname(socket.gethostname())
# host = "192.168.1.13"
app = Flask(__name__)
if Log_flag:
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
from modules.canvas.views import canvas_blueprint
app.register_blueprint(canvas_blueprint, url_prefix='/canvas')
@app.route('/')
def pdf_viewer_index():
    return render_template('main_page.html')
@app.route("/get_current_time")
def get_current_time():
    return jsonify(datetime.datetime.now().strftime('LT: %H:%M:%S'))
@app.route("/get_current_time_utc")
def get_current_time_utc():
    return jsonify(datetime.datetime.now(datetime.UTC).strftime('UTC: %H:%M:%S'))
global http_server
def create_webview():
    webbrowser.open(f'http://{host}:{port}')
def run_server():
    http_server = WSGIServer((host, port), app)
    http_server.serve_forever()
def stop_server(icon):
    os._exit(1)
def create_tray_icon():
    image = Image.open("./static/images/favicon.ico")  # Replace with the path to your icon image
    menu = (item('🌐Open EFB', create_webview),item('🛑Stop Server', stop_server))

    icon = pystray.Icon("AeroNav EFB", image, "AeroNav EFB", menu)
    return icon
if __name__ == '__main__':
    flask_thread = threading.Thread(target=run_server)
    tray_icon = create_tray_icon()
    flask_thread.start()
    webbrowser.open(f'http://{host}:{port}')
    tray_icon.run()
