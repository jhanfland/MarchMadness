import pytest
import sys
import os

# Path to locate 'app.py' in 'src/backend/'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src/backend')))

from src.backend.app import create_app, db
from src.backend.app.models import user

@pytest.fixture
def client():
    app = create_app()
    app.config['TESTING'] = True
    client = app.test_client()
    yield client

def test_hello_world(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.json == {"message": "Hello, World!"}

def test_register(client):
    response = client.post('/auth/register', json={"username": "testuser", "password": "securepassword"})
    assert response.status_code == 201
    assert "message" in response.json

def test_login(client):
    response = client.post('/auth/login', json={"username": "test", "password": "password"})
    assert response.status_code == 200
    assert "token" in response.json

def test_invalid_login(client):
    response = client.post('/auth/login', json={"username": "wrong", "password": "wrongpass"})
    assert response.status_code == 401
    assert response.json == {"error": "Invalid email or password."}

def test_logout(client):
    response = client.post('/auth/logout')
    assert response.status_code == 200
    assert response.json == {"message": "Logout successful"}

def test_forgot_password(client):
    response = client.post('/auth/forgot-password')
    assert response.status_code == 200
    assert response.json == {"message": "Password reset link sent"}

def test_duplicate_user_registration():
    client.post('/auth/register', json = {"username":"user1", "password":"password"})
    response = client.post('/auth/register', json = {"username":"user1", "password":"password"})
    assert response.status_code == 400
    assert response.json == {"error": "Email already exists"}

#Uncomment when the following pages are implements so they can be properly tested

#def test_reset_password():
#   response = client.post('/auth/reset-password')
#   assert response.status_code == 200
#   assert response.json == {"error": "Password reset successful"}
#
#def test_verify_email():
#   response = client.post('/auth/verify-email')
#   assert response.status_code == 200
#   assert response.json == {"message": "Email verified"}
#
#def test_resend_verification():
#   response = client.post('/auth/resend-verification')
#   assert response.status_code == 200
#   assert response.json == {"message": "Email verified"}
#
#def test_change_password():
#   response = client.post('/auth/change-password')
#   assert response.status_code == 200
#   assert response.json == {"message": "Password changed successfully"}
#
#def test_update_profile():
#   response = client.post('/auth/update-profile')
#   assert response.status_code == 200
#   assert response.json == {"message": "Profile updated"}
#
#def test_delete_account():
#   response = client.delete('/auth/delete-account')
#   assert response.status_code == 200
#   assert response.json == {"message": "Account deleted"}
#