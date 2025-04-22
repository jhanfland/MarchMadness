from flask import Blueprint, request, jsonify
import requests
import os
from dotenv import load_dotenv

# Load environment variables from .env file in root
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../../../..', '.env'))

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/api/witai')
def witai_proxy():
    message = request.args.get('message')
    token = os.getenv('WIT_AI_TOKEN')
    
    if not message or not token:
        return jsonify({'error': 'Missing message or token'}), 400

    try:
        response = requests.get(
            f"https://api.wit.ai/message?v=20240304&q={message}",
            headers={"Authorization": f"Bearer {token}"}
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

