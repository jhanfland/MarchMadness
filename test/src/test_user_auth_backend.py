import pytest
import sys
import os

# Path to locate 'app.py' in 'src/backend/'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../../src/backend')))

from app import app

@pytest.fixture
def client():
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
    assert response.json == {"message": "Invalid credentials"}

def test_logout(client):
    response = client.post('/auth/logout')
    assert response.status_code == 200
    assert response.json == {"message": "Logout successful"}

def test_forgot_password(client):
    response = client.post('/auth/forgot-password')
    assert response.status_code == 200
    assert response.json == {"message": "Password reset link sent"}
