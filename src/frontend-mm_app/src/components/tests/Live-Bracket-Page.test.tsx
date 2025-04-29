import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import LiveBracketPage from "@/Pages/Bracket/LiveBracketPage";


const mockApiResponse = {
    rounds: [
        {
            name: "Elite Eight",
            bracketed: [
                {
                    bracket: { name: "South" },
                    games: [
                        {
                            id: "13",
                            title: "Duke vs Houston",
                            home: { alias: "Duke", seed: "1" },
                            away: { alias: "Houston", seed: "2" },
                            scheduled: "2024-03-31T01:39:00Z",
                            venue: { name: "Test Venue", city: "Test City", state: "TS" }
                        },
                    ],
                },
            ],
        },
        {
            name: "Sweet Sixteen",
            bracketed: [
                {
                    bracket: { name: "South" },
                    games: [
                        {
                            id: "59",
                            title: "Duke vs Houston",
                            home: { alias: "Duke", seed: "1" },
                            away: { alias: "Houston", seed: "2" },
                            scheduled: "2024-03-30T02:39:00Z",
                            venue: { name: "Test Venue", city: "Test City", state: "TS" }
                        },
                    ],
                },
            ],
        },
    ],
};

describe("LiveBracketPage", () => {
    beforeEach(() => {
        global.fetch = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockApiResponse),
            })
        ) as unknown as typeof fetch;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("renders loading state initially", () => {
        render(<LiveBracketPage />);
        expect(screen.getByText(/Loading live bracket.../i)).toBeInTheDocument();
    });

    it("renders live bracket after fetch", async () => {
        render(<LiveBracketPage />);
        await waitFor(() => {
            // Wait for loading to disappear
            expect(screen.queryByText(/Loading live bracket.../i)).not.toBeInTheDocument();
        });
        // Check for team names in the bracket
        expect(screen.getByText(/Duke/i)).toBeInTheDocument();
        expect(screen.getByText(/Houston/i)).toBeInTheDocument();
    });

    it("handles fetch failure gracefully", async () => {
        (fetch as any).mockImplementationOnce(() =>
            Promise.resolve({ ok: false })
        );

        render(<LiveBracketPage />);
        // should remain the sames
        await waitFor(() => {
            expect(screen.getByText(/Loading live bracket.../i)).toBeInTheDocument();
        });
    });
});