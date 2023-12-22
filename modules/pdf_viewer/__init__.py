from flask import Blueprint

pdf_viewer_bp = Blueprint('pdf_viewer', __name__)

# Import views to register routes
from . import views
