<<<<<<< HEAD
import os
from pathlib import Path

=======
# mypy: disable-error-code="import-not-found, import-untyped"
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
>>>>>>> main
from config import Config
from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

# Get environment variables globally
<<<<<<< HEAD
api_key = os.getenv("BRACKET_API_KEY")
mm_tournament_id = os.getenv("MM_TOURNAMENT_ID")
prev_mm_tournament_id = os.getenv("MM_PREV_TOURNAMENT_ID")
=======
api_key = os.getenv('BRACKET_API_KEY')
mm_tournament_id = os.getenv('MM_TOURNAMENT_ID')
prev_mm_tournament_id = os.getenv('MM_PREV_TOURNAMENT_ID')
wit_ai_token = os.getenv('WIT_AI_TOKEN')
openai_api_key = os.getenv('OPENAI_API_KEY')
>>>>>>> main

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

<<<<<<< HEAD
    CORS(
        app, methods=["POST", "GET", "DELETE"]
    )  ## Allows Cross Origins Resource Sharing ie can recieve requests from different origin than the one it is hosted on
=======
    CORS(app)
    # Allows Cross Origins Resource Sharing ie can recieve requests from different
    # origin than the one it is hosted on
>>>>>>> main
    db.init_app(app)

    # Register Blueprints (Controllers)
    from app.routes.auth import auth_bp
    from app.routes.bracket import bracket_bp
<<<<<<< HEAD
    from app.routes.main import main_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(bracket_bp)

    # Register error handlers
=======
    from app.routes.chatbot import chatbot_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(bracket_bp)
    app.register_blueprint(chatbot_bp)
    
     # Register error handlers
>>>>>>> main
    from app.error_handlers import register_error_handlers

    register_error_handlers(app)
    return app
