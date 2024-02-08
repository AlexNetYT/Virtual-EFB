from flask import render_template, jsonify, request, Blueprint
import json
import os
import httpx
import signal
from . import collect_pdf_urls, pdf_viewer_bp
import socket
import logging
from rich import print
from flask import render_template, jsonify, request, Blueprint
import os
import httpx
import threading
from rich import print
from .parser_pdf import collect_pdf

host = socket.gethostbyname(socket.gethostname())
loading_charts = False

@pdf_viewer_bp.route('/')
def pdf_viewer():
    
    # Your existing PDF viewer code here
    return render_template('charts.html')

# ... (Other routes and functionality)

@pdf_viewer_bp.route('/start_loading_animation', methods=['POST'])
def start_loading_animation():
    global loading_charts
    loading_charts = True
    return jsonify({"status": "success"})
@pdf_viewer_bp.route('/check_folder_exists', methods=['POST'])
def check_folder_exists():
    icao_input = request.form.get('icao_input')
    folder_path = os.path.join('static', 'pdf_downloads', icao_input)

    folder_exists = os.path.exists(folder_path)

    # If the folder doesn't exist, call the new function to handle it
    return jsonify({"folder_exists": True})
@pdf_viewer_bp.route('/get_pdfs_by_tag/<tag>/<icao>', )
def get_pdfs_by_tag(tag, icao):
    pdf_info = json.loads(collect_pdf_urls.collect_pdf(icao))
    filtered_pdfs = [pdf for pdf in pdf_info['pdfs']
                     if tag in pdf['tags']]
    return jsonify({"pdf_files": [{"fn": pdf['filename'], "fl": pdf['link']} for pdf in filtered_pdfs]})


@pdf_viewer_bp.route('/get_pdfs_by_icao/<subfolder>')
def get_pdfs(subfolder):
    pdf_info = json.loads(collect_pdf_urls.collect_pdf(subfolder))
    # pdf_folder = os.path.join("static/", 'pdf_downloads', subfolder)
    pdf_files = [{"fn": pdf['filename'], "fl": pdf['link'], "ap":pdf['airport']} for pdf in pdf_info['pdfs']]
    print(pdf_files)
    return jsonify({'pdf_files': pdf_files})

@pdf_viewer_bp.route('/stop_loading_animation', methods=['POST'])
def stop_loading_animation():
    global loading_charts
    loading_charts = False
    return jsonify({"status": "success"})

# ... (Your existing code)



@pdf_viewer_bp.route('/handle_folder_not_found', methods=['POST'])
def handle_folder_not_found():
    icao_input = request.form.get('icao_input')
    
    response = httpx.post(f'http://{host}:5000/stop_loading_animation')
    return jsonify({"status": "success"})

# ... (Other routes and functionality)


# ... (Your existing code)
@pdf_viewer_bp.route('/')
def pdf_viewer_index():
    print()
    return render_template('modules/pdf_viewer/index.html')
@pdf_viewer_bp.route('/shutdown_server', methods=['POST'])
def shutdown_server():
    global server
    os.kill(os.getpid(), signal.SIGINT)
    return jsonify({"success": True, "message": "Server is shutting down..."})
