from flask import Blueprint, request, jsonify, session
from app import db, api_key, mm_tournament_id, prev_mm_tournament_id
from app.models.bracket import Bracket
from app.models.user import User
import datetime
import requests
from flask import current_app as app

bracket_bp = Blueprint('bracket', __name__)

# Returns live bracket from API
@bracket_bp.route('/get_bracket', methods=['GET'])
def get_realtime_bracket():
    # switch out mm_tournament_id, with prev_mm_tournament_id dependent on what you need to understand/use
    url = f"https://api.sportradar.com/ncaamb/trial/v8/en/tournaments/{prev_mm_tournament_id}/schedule.json?api_key={api_key}"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json())

# Returns users bracket that has already been created
@bracket_bp.route('/get_user_bracket/<int:bracket_number>', methods=['GET'])
def get_user_bracket(bracket_number):
    # User Verification
    user, mes, errNum = verify_user()
    if (user == None):
        return mes, errNum

    # Fetch the user's bracket by user_id and bracket_number
    bracket = Bracket.query.filter_by(id=user.id, bracket_number=bracket_number).first()
    if not bracket:
        return jsonify({'error': 'Bracket not found'}), 404
    
    # Return the bracket selection data
    return jsonify({
        'message': 'Bracket retrieved successfully',
        'bracket': bracket.bracket_selection
    }), 200

# Created User Bracket
@bracket_bp.route('/create_user_bracket', methods=['POST'])
def create_user_bracket():
    # User Verification
    user, mes, errNum = verify_user()
    if (user == None):
        return mes, errNum
    # Get bracket number  and bracket selection
    data = request.get_json()
    bracket_number = data.get('bracket_number')
    bracket_selection = data.get('bracket_selection')
    if not bracket_number or not bracket_selection:
        return jsonify({'error': 'Bracket number and bracket selection are required'}), 400
    # Check if the user already has a bracket for the given bracket_number
    existing_bracket = Bracket.query.filter_by(id=user.id, bracket_number=bracket_number).first()
    if existing_bracket:
        # If the bracket exists, we can either update
        existing_bracket.bracket_selection = bracket_selection
        db.session.commit()
        return jsonify({'message': 'Bracket updated successfully', 'bracket': bracket_selection}), 200

    # If the bracket doesn't exist, create a new one
    new_bracket = Bracket(
        id=user.id,
        bracket_number=bracket_number,
        bracket_selection=bracket_selection
    )
    db.session.add(new_bracket)
    db.session.commit()
    return jsonify({'message': 'Bracket created successfully', 'bracket': bracket_selection}), 201

# User Verification
def verify_user():
    # Extract the token from the Authorization header
    auth_header = request.headers.get('Authorization')
    if not auth_header:
        return None, jsonify({'error': 'Authorization header missing'}), 401

    # The token should be in the form 'Bearer <token>'
    token = auth_header.split(" ")[1] if len(auth_header.split()) > 1 else None
    if not token:
        return None, jsonify({'error': 'Token missing'}), 401

    # Use the token as the user ID (or replace with your preferred method)
    user_id = token

    # Retrieve the user from the database using the provided user_id
    user = User.query.get(user_id)
    if not user:
        return None, jsonify({'error': 'User not found'}), 404
    
    return user, None, None


