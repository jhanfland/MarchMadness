from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config
from dotenv import load_dotenv
from pathlib import Path
import os

# Get environment variables globally
api_key = os.getenv('BRACKET_API_KEY')
mm_tournament_id = os.getenv('MM_TOURNAMENT_ID')
prev_mm_tournament_id = os.getenv('MM_PREV_TOURNAMENT_ID')

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app) ## Allows Cross Origins Resource Sharing ie can recieve requests from different origin than the one it is hosted on 
    db.init_app(app)

    # Register Blueprints (Controllers) 
    from app.routes.auth import auth_bp
    from app.routes.main import main_bp
    from app.routes.bracket import bracket_bp
    from app.routes.chatbot import chatbot_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    app.register_blueprint(bracket_bp)
    app.register_blueprint(chatbot_bp)
    
     # Register error handlers
    from app.error_handlers import register_error_handlers
    register_error_handlers(app)
    return app
