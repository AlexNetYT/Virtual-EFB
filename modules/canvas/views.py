from flask import render_template, Blueprint, jsonify
canvas_blueprint = Blueprint('canvas', __name__)

@canvas_blueprint.route('/')
def canvas_index():
    return render_template('canvas.html')
