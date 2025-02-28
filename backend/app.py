from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return jsonify({"message": "Hello, World!"})

@app.route('/auth/register')
def register():
    return jsonify({"message": "Register endpoint"})

@app.route('/auth/login')
def login():
    return jsonify({"message": "Login endpoint"})

@app.route('/auth/logout')
def logout():
    return jsonify({"message": "Logout endpoint"})

@app.route('/auth/forgot-password')
def forgot_password():
    return jsonify({"message": "Forgot password endpoint"})

@app.route('/auth/reset-password')
def reset_password():
    return jsonify({"message": "Reset password endpoint"})

@app.route('/auth/verify-email')
def verify_email():
    return jsonify({"message": "Verify email endpoint"})

@app.route('/auth/resend-verification')
def resend_verification():
    return jsonify({"message": "Resend verification endpoint"})

@app.route('/auth/change-password')
def change_password():
    return jsonify({"message": "Change password endpoint"})

@app.route('/auth/update-profile')  
def update_profile():
    return jsonify({"message": "Update profile endpoint"})

@app.route('/auth/delete-account')
def delete_account():
    return jsonify({"message": "Delete account endpoint"})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
