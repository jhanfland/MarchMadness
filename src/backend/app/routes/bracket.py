from flask import Blueprint, request, jsonify, session
from app import db, api_key, mm_tournament_id, prev_mm_tournament_id
from app.models.bracket import Bracket
from app.models.user import User
import datetime
import requests
from flask import current_app as app
from sqlalchemy import func

bracket_bp = Blueprint('bracket', __name__)

# Returns live bracket from API
@bracket_bp.route('/get_bracket', methods=['GET'])
def get_realtime_bracket():
    # switch out mm_tournament_id, with prev_mm_tournament_id dependent on what you need to understand/use
    url = f"https://api.sportradar.com/ncaamb/trial/v8/en/tournaments/{mm_tournament_id}/schedule.json?api_key={api_key}"
    headers = {"accept": "application/json"}
    response = requests.get(url, headers=headers)
    return jsonify(response.json())


@bracket_bp.route('/generate_bracket_template', methods=['GET'])
def generate_bracket_template():
    # copied from above
    url = f"https://api.sportradar.com/ncaamb/trial/v8/en/tournaments/{mm_tournament_id}/schedule.json?api_key={api_key}"
    headers = {"accept": "application/json"}  # <-- include this
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        return jsonify({'error': 'Failed to get data from API'}), 500

    data = response.json()

    # loops and filters API to find first round
    first_round = next((r for r in data['rounds'] if r['name'] == 'First Round'), None)
    if not first_round:
        return jsonify({'error': 'First Round not found'}), 404

    # values from API
    region_map = {0: "SOUTH", 1: "MIDWEST", 2: "EAST", 3: "WEST"}

    region_seeds = {region: [] for region in region_map.values()}

    # Loop through each bracketed region from the API's First Round data
    for i, region in enumerate(first_round.get("bracketed", [])):
        # gets from region_map
        region_name = region_map.get(i, f"Region {i}")
        # sort games - copies Krishaan's code but in python
        games = region.get("games", [])
        games.sort(key=lambda g: int(g.get("title", "Game 99").split("Game ")[-1]))            
            # Build a Seed - one of 8 games in reigon
        for game_index, game in enumerate(games):
            seed = {
                "id": game_index + 1,
                "date": game.get("scheduled", ""),
                "teams": [
                    { "name": game.get("home", {}).get("name", "TBD"), "seed": game.get("home", {}).get("seed")},
                    { "name": game.get("away", {}).get("name", "TBD"), "seed": game.get("away", {}).get("seed")}
                ]
            }
            region_seeds[region_name].append(seed)

    # builds bracket structure to send to frontend
    bracket = {
        "id": int(datetime.datetime.now().timestamp()),
        "title": "March Madness Bracket",
        "regions": region_seeds
    }

    return jsonify(bracket), 200

@bracket_bp.route('/get_user_bracket_id', methods=['GET'])
def get_bracket_id():
    user, mes, errNum = verify_user()
    if (user == None):
        return mes, errNum
    max_bracket = db.session.query(func.max(Bracket.bracket_number))\
                            .filter_by(id=user.id)\
                            .scalar()
    # If user has no brackets, start from 1
    next_bracket_number = (max_bracket or 0) + 1
    return jsonify({'next_bracket_number': next_bracket_number})

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


