from flask import Flask, render_template, jsonify, request
import json
import os
import requests
import signal
import parser_pdf
import socket
import m
import logging
from rich import print
import webview,threading
global host
host = socket.gethostbyname(socket.gethostname())
global server
server = None
app = Flask(__name__)
log = logging.getLogger('werkzeug')
log.disabled = True
app.logger.disabled = True
# Load PDF information from a JSON file

# host = '192.168.1.10'

# Load VATSpy data into a dictionary for quick lookup
vat_spy_data = {}
with open('VATSpy.dat', 'r') as vat_spy_file:
    for line in vat_spy_file:
        icao, name, *_ = line.strip().split('|')
        vat_spy_data[icao] = name

# Flag to indicate whether the charts are currently being loaded
loading_charts = False

# New route to start the loading animation


@app.route('/start_loading_animation', methods=['POST'])
def start_loading_animation():
    global loading_charts
    loading_charts = True
    return jsonify({"status": "success"})
# New route to stop the loading animation


@app.route('/stop_loading_animation', methods=['POST'])
def stop_loading_animation():
    global loading_charts
    loading_charts = False
    return jsonify({"status": "success"})


def handle_folder_not_found_py(icao_input):
    # You can add your logic here, for example, create the folder
    # or perform any other action based on your requirements.
    # For now, let's just log a message.
    response = requests.post(f'http://{host}:5000/start_loading_animation')
    res = parser_pdf.collect_pdf(
        './static/pdf_downloads', icao_input, host=host)
    stop_loading_animation()
    response = requests.post(f'http://{host}:5000/stop_loading_animation')
    print(f"Folder for ICAO code '{icao_input}' not found. Handling it...")


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/get_pdfs_by_tag/<tag>/<icao>')
def get_pdfs_by_tag(tag, icao):
    with open('pdf_info.json', 'r') as file:
        pdf_info = json.load(file)
    filtered_pdfs = [pdf for pdf in pdf_info['pdfs']
                     if tag in pdf['tags'] and pdf['airport'] == icao.upper()]
    return jsonify({"pdf_files": [pdf['filename'] for pdf in filtered_pdfs]})


@app.route('/get_pdfs_by_icao/<subfolder>')
def get_pdfs(subfolder):
    pdf_folder = os.path.join(app.static_folder, 'pdf_downloads', subfolder)
    pdf_files = [file for file in os.listdir(
        pdf_folder) if file.lower().endswith('.pdf')]
    return jsonify({'pdf_files': pdf_files})


@app.route('/get_name_by_icao/<icao>')
def get_name_by_icao(icao):
    name = vat_spy_data.get(icao, 'Unknown')
    return jsonify({"name": name})


@app.route('/handle_folder_not_found', methods=['POST'])
def handle_folder_not_found():
    return jsonify({"status": "success"})

# New route to check if a folder with the specified ICAO code exists


@app.route('/check_folder_exists', methods=['POST'])
def check_folder_exists():
    icao_input = request.form.get('icao_input')
    folder_path = os.path.join('static', 'pdf_downloads', icao_input)

    folder_exists = os.path.exists(folder_path)

    # If the folder doesn't exist, call the new function to handle it
    if not folder_exists:
        handle_folder_not_found_py(icao_input)
        response = requests.post(f'http://{host}:5000/stop_loading_animation')
    return jsonify({"folder_exists": folder_exists})


def start_server():
    app.run(host=host)


@app.route('/shutdown_server', methods=['POST'])
def shutdown_server():
    global server
    os.kill(os.getpid(), signal.SIGINT)
    return jsonify({"success": True, "message": "Server is shutting down..."})


if __name__ == '__main__':
    print(f"[green1][bold]App started![/green1][/bold]\n[bold]Open [royal_blue1][italic]http://{host}/[/royal_blue1][/italic] in your browser[/bold]\n[red3]To stop server press Ctrl-C or Close the window[/red3]")
    
    t = threading.Thread(target=start_server)
    t.daemon = True
    t.start()

    webview.create_window("AeroNav Viewer", f"http://{host}:5000/", confirm_close=True, width=1920, height=1080)
    webview.start()