import axios from 'axios';

const backendUrl = 'http://localhost:8000';
// backend API endpoint tests
describe('Flask API Tests', () => {
  let testUser = { email: `test${Date.now()}@example.com`, password: "password" };
  let authToken: string;

  describe('User Registration and Authentication', () => {
    it('should register a new user', async () => {
      const response = await axios.post(`${backendUrl}/auth/register`, testUser);
      expect(response.status).toBe(201);
      expect(response.data.message).toBe('User registered');
    });

    it('should log in an existing user and return a token', async () => {
      const response = await axios.post(`${backendUrl}/auth/login`, testUser);
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Login successful');
      expect(response.data.token).toBeDefined();
      authToken = response.data.token;
    });

    it('should not log in with incorrect credentials', async () => {
      try {
        await axios.post(`${backendUrl}/auth/login`, { email: testUser.email, password: "password" });
      } catch (error: any) {
        expect(error.response.status).toBe(401);
        expect(error.response.data.error).toBe('Invalid email or password.');
      }
    });
  });

  describe('Logout and Profile Management', () => {
    it('should log out the user', async () => {
      const response = await axios.post(`${backendUrl}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Logout successful');
    });
  });

  describe('Password and Account Management', () => {
    it('should send a password reset link', async () => {
      const response = await axios.post(`${backendUrl}/auth/forgot-password`, { email: testUser.email });
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Password reset link sent');
    });
  });

  describe('Email Verification', () => {
    it('should verify email', async () => {
      const response = await axios.get(`${backendUrl}/auth/verify-email`);
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Email verified');
    });
  });

  describe('Profile and Account Deletion', () => {
    it('should delete the user account', async () => {
      const response = await axios.delete(`${backendUrl}/auth/delete-account`);
      expect(response.status).toBe(200);
      expect(response.data.message).toBe('Account deleted');
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for a non-existent endpoint', async () => {
      try {
        await axios.get(`${backendUrl}/non-existent-route`);
      } catch (error: any) {
        expect(error.response.status).toBe(404);
        expect(error.response.data.message).toBe('Not Found');
      }
    });
  });
});