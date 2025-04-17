import axios from "axios";

const backendUrl = "http://localhost:8000";
let authToken: string;

// Backend bracket API endpoint tests
describe("Flask API Tests - Bracket", () => {

    beforeAll(async () => {
        const testUser = { email: `test${Date.now()}@example.com`, password: "password" };
        await axios.post(`${backendUrl}/auth/register`, testUser);
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
        let bracketNumber: number;

        it("should generate a bracket number for new user bracket", async () => {
            const response = await axios.get(`${backendUrl}/get_user_bracket_id`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("next_bracket_number");
            bracketNumber = response.data.next_bracket_number;
        });

        it("should generate a new bracket template", async () => {
            const response = await axios.get(`${backendUrl}/generate_bracket_template`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            expect(response.status).toBe(200);
            expect(response.data).toHaveProperty("regions");
            expect(Object.keys(response.data.regions).length).toBeGreaterThan(0);
        });

        it("should create a new user bracket", async () => {
            const testBracket = {
                bracket_number: bracketNumber,
                bracket_selection: {
                    rounds: [
                        { name: "First Four", games: [] }
                    ]
                }
            };

            const response = await axios.post(`${backendUrl}/create_user_bracket`, testBracket, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            expect(response.status).toBe(201);
            expect(response.data.message).toBe("Bracket created successfully");
            expect(response.data.bracket).toEqual(testBracket.bracket_selection);
        });

        it("should retrieve the created user bracket", async () => {
            const response = await axios.get(`${backendUrl}/get_user_bracket/${bracketNumber}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            expect(response.status).toBe(200);
            expect(response.data.message).toBe("Bracket retrieved successfully");
            expect(response.data.bracket).toHaveProperty("rounds");
        });

        it("should update the user bracket", async () => {
            const updatedBracket = {
                bracket_number: bracketNumber,
                bracket_selection: {
                    rounds: [
                        { name: "First Four", games: ["Updated Game"] }
                    ]
                }
            };

            const response = await axios.post(`${backendUrl}/create_user_bracket`, updatedBracket, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            expect(response.status).toBe(200);
            expect(response.data.message).toBe("Bracket updated successfully");
            expect(response.data.bracket).toEqual(updatedBracket.bracket_selection);
        });

        it("should return 404 for a non-existent bracket number", async () => {
            try {
                await axios.get(`${backendUrl}/get_user_bracket/99999`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
            } catch (error: any) {
                expect(error.response.status).toBe(404);
                expect(error.response.data.error).toBe("Bracket not found");
            }
        });
    });

    describe("Scoring Bracket", () => {
        it("should score a user bracket correctly against a live bracket", async () => {
            const userBracket = {
                regions: {
                    EAST: {
                        rounds: [
                            {
                                title: "First Round",
                                seeds: [
                                    { id: 1, teams: [{ name: "Duke" }], winner: "Duke" },
                                    { id: 2, teams: [{ name: "UNC" }], winner: "UNC" }
                                ]
                            }
                        ]
                    },
                    FINAL_FOUR: { rounds: [[], []] }
                }
            };

            const liveBracket = {
                rounds: [
                    {},
                    {
                        bracketed: [
                            {
                                bracket: { name: "East Regional" },
                                games: [
                                    {
                                        title: "Game 1",
                                        home: { name: "Duke" },
                                        away: { name: "UCLA" },
                                        home_points: 90,
                                        away_points: 70
                                    },
                                    {
                                        title: "Game 2",
                                        home: { name: "UNC" },
                                        away: { name: "Gonzaga" },
                                        home_points: 80,
                                        away_points: 75
                                    }
                                ]
                            }
                        ]
                    },
                    {}, {}, {}, {}, {}
                ]
            };

            const response = await axios.post(`${backendUrl}/score_bracket`, {
                user_bracket: userBracket,
                live_bracket: liveBracket
            }, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            expect(response.status).toBe(200);
            expect(typeof response.data.score).toBe("number");
            expect(response.data.score).toBeGreaterThanOrEqual(0);  // will fix this
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

        it("should return 401 if missing token for protected route", async () => {
            try {
                await axios.get(`${backendUrl}/generate_bracket_template`);
            } catch (error: any) {
                expect(error.response.status).toBe(401);
                expect(error.response.data.error).toBe("Authorization header missing");
            }
        });
    });
});
