from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from config import Config

db = SQLAlchemy()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app) ## Allows Cross Origins Resource Sharing ie can recieve requests from different origin than the one it is hosted on 
    db.init_app(app)

    # Register Blueprints (Controllers) 
    from app.routes.auth import auth_bp
    from app.routes.main import main_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(main_bp)
    
     # Register error handlers
    from app.error_handlers import register_error_handlers
    register_error_handlers(app)

    return app
