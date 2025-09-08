# app/__init__.py
from flask import Flask
from flask_cors import CORS
from .routes.analysis_routes import analysis_bp

def create_app():
    app = Flask(__name__)
    CORS(app)  # CORS ko enable karein

    # Register the blueprint
    app.register_blueprint(analysis_bp, url_prefix='/api/v1')

    @app.route('/test')
    def test_route():
        return "Hello, World! The server is running."

    return app