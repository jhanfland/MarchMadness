from flask import Flask, request, jsonify, abort, session
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import os

# Initialize Flask App
app = Flask(__name__)
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL") # In env file

db = SQLAlchemy(app)

# Database Model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Create Tables
def create_tables():
    with app.app_context():
        db.create_all()

# Error Handling
@app.errorhandler(500)
def internal_error(error):
    return jsonify({"message": "Internal Server Error"}), 500

@app.errorhandler(404)
def not_found_error(error):
    return jsonify({"message": "Not Found Error"}), 404

# Triggering a 500 Internal Server Error intentionally
@app.route('/some-500-error-route')
def some_500_error_route():
    abort(500)

# Route Configuration

@app.route('/')
def hello_world():
    return jsonify({"message": "Hello, World!"})

@app.route('/test')
def test():
    return jsonify({"message": "Test route works!"})


@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    new_user = User(email=email, password=password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered", "user": data}), 201   # HTTP status code 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()
    if not user or user.password != password:  # Direct password comparison
        return jsonify({'error': 'Invalid email or password.'}), 401

    session['user_id'] = user.id
    return jsonify({'message': 'Login successful', 'token': user.id}), 200

@app.route('/auth/logout', methods=['POST'])
def logout():
    session.pop('user_id', None)  # Remove user session

    return jsonify({"message": "Logout successful"}), 200 

@app.route('/auth/forgot-password', methods=['GET', 'POST'])
def forgot_password():
    return jsonify({"message": "Password reset link sent"}), 200

@app.route('/auth/reset-password', methods=['POST'])
def reset_password():
    return jsonify({"message": "Password reset successful"}), 200

@app.route('/auth/verify-email', methods=['GET'])
def verify_email():
    return jsonify({"message": "Email verified"}), 200

@app.route('/auth/resend-verification', methods=['POST'])
def resend_verification():
    return jsonify({"message": "Verification email resent"}), 200

@app.route('/auth/change-password', methods=['POST'])
def change_password():
    return jsonify({"message": "Password changed successfully"}), 200

@app.route('/auth/update-profile', methods=['POST'])  
def update_profile():
    return jsonify({"message": "Profile updated"}), 200

@app.route('/auth/delete-account', methods=['DELETE'])
def delete_account():
    return jsonify({"message": "Account deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)
