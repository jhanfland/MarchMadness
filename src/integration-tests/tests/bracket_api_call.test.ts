import axios from "axios";

const backendUrl = "http://localhost:8000"; 
let authToken: string;

// Backend bracket API endpoint tests
describe("Flask API Tests - Bracket", () => {

    beforeAll(async () => {
        // Simulate user login to get an auth token
        const testUser = { email: `test${Date.now()}@example.com`, password: "password" };
        
        // Register a test user
        await axios.post(`${backendUrl}/auth/register`, testUser);

        // Log in to get auth token
        const loginResponse = await axios.post(`${backendUrl}/auth/login`, testUser);
        authToken = loginResponse.data.token;
    });

    describe("Live Tournament Bracket", () => {
        it("should retrieve the live tournament bracket", async () => {
            const response = await axios.get(`${backendUrl}/get_bracket`);
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("rounds");
            expect(Array.isArray(response.data.rounds)).toBe(true);
        });
    });

    describe("User Bracket Management", () => {
        let testBracket = {
            "bracket_number": 1,
            "bracket_selection": {
                "rounds": [
                    { 
                        "name": "First Four", 
                        "games": [] 
                    }
                ]
            }
        };

        it("should return 404 for a non-existent user bracket", async () => {
            try {
                await axios.get(`${backendUrl}/get_user_bracket/999`, {
                    headers: { Authorization: `Bearer ${authToken}` }
                });
            } catch (error: any) {
                expect(error.response.status).toBe(404);
                expect(error.response.data.error).toBe("Bracket not found");
            }
        });

        it("should create a new user bracket", async () => {
            const response = await axios.post(`${backendUrl}/create_user_bracket`, testBracket, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(201);
            expect(response.data.message).toBe("Bracket created successfully");
            expect(response.data.bracket).toEqual(testBracket.bracket_selection);
        });

        it("should retrieve an existing user bracket", async () => {
            const response = await axios.get(`${backendUrl}/get_user_bracket/1`, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.message).toBe("Bracket retrieved successfully");
            expect(response.data.bracket).toHaveProperty("rounds");
        });

        it("should update an existing user bracket", async () => {
            const updatedBracket = {
                bracket_number: 1,
                bracket_selection: {
                rounds: [{ name: "First Round", games: ["Updated Game"] }],
                },
            };
            const response = await axios.post(`${backendUrl}/create_user_bracket`, updatedBracket, {
                headers: { Authorization: `Bearer ${authToken}` }
            });
            expect(response.status).toBe(200);
            expect(response.data.message).toBe("Bracket updated successfully");
            expect(response.data.bracket).toEqual(updatedBracket.bracket_selection);

        });
    });

    describe("Error Handling", () => {
        it("should return 404 for a non-existent endpoint", async () => {
            try {
                await axios.get(`${backendUrl}/non-existent-route`);
            } catch (error: any) {
                expect(error.response.status).toBe(404);
                expect(error.response.data.message).toBe("Not Found");
            }
        });
    });

});
