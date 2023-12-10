from flask import Blueprint, render_template, request, jsonify
from . import simbrief_connect


from flask import Blueprint, render_template, jsonify

ofp_bp = Blueprint("ofp", __name__, url_prefix="/ofp")

@ofp_bp.route("/get_ofp_info/<userid>", methods=["GET"])
def get_ofp_info(userid):
    js = simbrief_connect.compile_data(userid)
    # You can replace this with logic to fetch real OFP data
    return jsonify(js)

@ofp_bp.route("/", methods=["GET"])
def ofp_page():
    return render_template("ofp.html")
