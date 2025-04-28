from flask import Blueprint, request, jsonify
from app import wit_ai_token, openai_api_key
import requests

chatbot_bp = Blueprint('chatbot', __name__)

@chatbot_bp.route('/api/witai')
def witai_proxy():
    message = request.args.get('message')
    token = wit_ai_token;
    
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

@chatbot_bp.route('/api/openai', methods=['POST'])
def openai_proxy():
    data = request.get_json()
    message = data.get('message')
    token = openai_api_key;
    
    if not message or not token:
        return jsonify({'error': 'Missing message or token'}), 400

    try:
        response = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            },
            json={
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": message}]
            }
        )
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

