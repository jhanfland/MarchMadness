from flask import Blueprint, request, jsonify, session
from app import db
from app.models.user import User
import jwt
import datetime
from flask import current_app as app

auth_bp = Blueprint('auth', __name__, url_prefix='/auth')

# Route for user registration
@auth_bp.route('/register', methods=['POST'])
def register():

    data = request.get_json()
    new_user = User(email=data['email'], password=data['password'], balance=data.get('balance', 0))
    
    # Handle existing email edge case
    existing_user = User.query.filter_by(email=data['email']).first()
    if existing_user:
        return jsonify({"error": "Email already exists"}), 400
    
    # Add new user to database
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered", "user": data}), 201

# Route for user login
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()    # Find user email in database
    if not user or user.password != password:  # Direct password comparison (Maybe hash password later)
        return jsonify({'error': 'Invalid email or password.'}), 401

    # Store user ID in session for auth
    session['id'] = user.id
    return jsonify({'message': 'Login successful', 'token': user.id}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user session

    return jsonify({"message": "Logout successful"}), 200 

## Dummy routes (for now), possibly delete: 
@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    return jsonify({"message": "Password reset link sent"}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    return jsonify({"message": "Password reset successful"}), 200

@auth_bp.route('/verify-email', methods=['GET'])
def verify_email():
    return jsonify({"message": "Email verified"}), 200

@auth_bp.route('/resend-verification', methods=['POST'])
def resend_verification():
    return jsonify({"message": "Verification email resent"}), 200

@auth_bp.route('/change-password', methods=['POST'])
def change_password():
    return jsonify({"message": "Password changed successfully"}), 200

@auth_bp.route('/update-profile', methods=['POST'])  
def update_profile():
    return jsonify({"message": "Profile updated"}), 200

@auth_bp.route('/delete-account', methods=['DELETE'])
def delete_account():
    return jsonify({"message": "Account deleted"}), 200
