from flask import Blueprint, render_template, request, jsonify
from . import simbrief_connect
from . import msfs_connect, msfs_fpln_reader
import os
from flask import Blueprint, render_template, jsonify, flash, redirect,url_for
ofp_bp = Blueprint("ofp", __name__, url_prefix="/ofp")

ALLOWED_EXTENSIONS = set(['pln', 'pdf', 'png', 'jpg', 'jpeg', 'gif'])

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS


@ofp_bp.route("/get_ofp_info/<userid>", methods=["GET"])
def get_ofp_info(userid):
    js = simbrief_connect.compile_data(userid)
    # You can replace this with logic to fetch real OFP data
    return jsonify(js)

@ofp_bp.route("/get_position/", methods=["GET"])
def get_position():
    payload = msfs_connect.get_location()
    return jsonify(payload)


@ofp_bp.route("/upload", methods=["GET", "POST"])
def upload():
    if request.method == 'POST':
        file = request.files['file']
        if file and allowed_file(file.filename):
            text = file.stream.read()
            dct = msfs_fpln_reader.compile_data(text)
            return jsonify(dct)
@ofp_bp.route("/", methods=["GET"])
def ofp_page():
    return render_template("ofp.html")
