import { render, screen, waitFor } from "@testing-library/react";
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
                            home: { alias: "Duke" },
                            away: { alias: "Houston" },
                            scheduled: "2024-03-31T01:39:00Z",
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
                            home: { alias: "Duke" },
                            away: { alias: "Houston" },
                            scheduled: "2024-03-30T02:39:00Z",
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
        expect(screen.getByText(/loading brackets/i)).toBeInTheDocument();
    });

    it("renders live bracket after fetch", async () => {
        render(<LiveBracketPage />);
        await waitFor(() => {
            expect(screen.getByText("Duke")).toBeInTheDocument();
            expect(screen.getByText("Houston")).toBeInTheDocument();
        });
    });

    it("handles fetch failure gracefully", async () => {
        (fetch as any).mockImplementationOnce(() =>
            Promise.resolve({ ok: false })
        );

        render(<LiveBracketPage />);
        await waitFor(() => {
            expect(screen.getByText(/loading brackets/i)).toBeInTheDocument();
        });
    });
});