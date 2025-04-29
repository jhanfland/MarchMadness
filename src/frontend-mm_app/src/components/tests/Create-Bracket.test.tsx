import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import BracketPage from "@/Pages/Bracket/BracketPage";
import Bracket from "@/Pages/Bracket/components/bracket";

const mockBracket = {
    id: 1,
    title: "March Madness Bracket",
    regions: {
        EAST: [
            { id: 1, date: "2025-03-21", teams: [{ name: "E1" }, { name: "E16" }] },
            { id: 2, date: "2025-03-21", teams: [{ name: "E8" }, { name: "E9" }] },
            { id: 3, date: "2025-03-21", teams: [{ name: "E5" }, { name: "E12" }] },
            { id: 4, date: "2025-03-21", teams: [{ name: "E4" }, { name: "E13" }] },
        ],
        WEST: [
            { id: 1, date: "2025-03-21", teams: [{ name: "W1" }, { name: "W16" }] },
            { id: 2, date: "2025-03-21", teams: [{ name: "W8" }, { name: "W9" }] },
            { id: 3, date: "2025-03-21", teams: [{ name: "W5" }, { name: "W12" }] },
            { id: 4, date: "2025-03-21", teams: [{ name: "W4" }, { name: "W13" }] },
        ],
        SOUTH: [
            { id: 1, date: "2025-03-21", teams: [{ name: "S1" }, { name: "S16" }] },
            { id: 2, date: "2025-03-21", teams: [{ name: "S8" }, { name: "S9" }] },
            { id: 3, date: "2025-03-21", teams: [{ name: "S5" }, { name: "S12" }] },
            { id: 4, date: "2025-03-21", teams: [{ name: "S4" }, { name: "S13" }] },
        ],
        MIDWEST: [
            { id: 1, date: "2025-03-21", teams: [{ name: "M1" }, { name: "M16" }] },
            { id: 2, date: "2025-03-21", teams: [{ name: "M8" }, { name: "M9" }] },
            { id: 3, date: "2025-03-21", teams: [{ name: "M5" }, { name: "M12" }] },
            { id: 4, date: "2025-03-21", teams: [{ name: "M4" }, { name: "M13" }] },
        ],
        "FINAL FOUR": [],
    },
};

describe("Bracket Component", () => {
    it("renders all region buttons and bracket title", () => {
        render(<Bracket bracket={mockBracket} liveBracket={false} />);
        expect(screen.getByText("March Madness Bracket")).toBeInTheDocument();
        ["EAST", "WEST", "SOUTH", "MIDWEST", "FINAL FOUR"].forEach((region) => {
            expect(screen.getByText(region)).toBeInTheDocument();
        });
    });

    it("switches between regions when buttons are clicked", () => {
        render(<Bracket bracket={mockBracket} liveBracket={false} />);
        
        // Click WEST button
        fireEvent.click(screen.getByText("WEST"));
        expect(screen.getByText("WEST")).toHaveClass("text-white");
        expect(screen.getByText("EAST")).toHaveClass("text-gray-500");
        
        // Click EAST button
        fireEvent.click(screen.getByText("EAST"));
        expect(screen.getByText("EAST")).toHaveClass("text-white");
        expect(screen.getByText("WEST")).toHaveClass("text-gray-500");
    });

    it("automatically builds Final Four when all region winners are selected", () => {
        render(<Bracket bracket={mockBracket} liveBracket={false} />);

        // Simulate all Elite 8 selections (index 3 = Elite 8)
        const regionKeys = ["EAST", "WEST", "SOUTH", "MIDWEST"];
        regionKeys.forEach((region) => {
            const key = `3-0-${region}`;
            window.dispatchEvent(new CustomEvent("select-team", { detail: { key, value: `${region} Champ-99-0` } }));
        });

        fireEvent.click(screen.getByText("FINAL FOUR"));
        expect(screen.getByText("East Champ")).toBeInTheDocument();
        expect(screen.getByText("Midwest Champ")).toBeInTheDocument();
    });
});

// Used to test createBracket function in BracketPage component without needing a real API call
const mockBracketResponse = {
    id: "generated-id",
    title: "Generated Bracket",
    regions: {
        EAST: [],
        WEST: [],
        SOUTH: [],
        MIDWEST: [],
        "FINAL FOUR": [],
    },
};

// Mock the fetch API
global.fetch = vi.fn();

describe("BracketPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("token", "test-token");
  });

  afterEach(() => {
    localStorage.removeItem("token");
  });

  it("displays message when user is not logged in", async () => {
    localStorage.removeItem("token");
    render(<BracketPage />);
    await waitFor(() => {
      expect(screen.getByText(/Login required/i)).toBeInTheDocument();
    });
  });

  it("No brackets message", async () => {
    render(<BracketPage initialBrackets={[]} />);
    await waitFor(() => {
      expect(screen.getByText(/Could not load brackets/i)).toBeInTheDocument();
    });
  });

  it("creates and displays a new bracket on button click", async () => {
    render(<BracketPage initialBrackets={[]} />);
    fireEvent.click(screen.getByText(/CREATE NEW BRACKET/i));

    await waitFor(() => {
      expect(screen.getByText(/Brackets/i)).toBeInTheDocument();
    });
  });

  it("handles API error gracefully", async () => {
    (fetch as any).mockImplementationOnce(() =>
      Promise.reject(new Error("API Error"))
    );

    render(<BracketPage initialBrackets={[]} />);
    fireEvent.click(screen.getByText(/CREATE NEW BRACKET/i));

    await waitFor(() => {
      expect(screen.getByText(/Could not load brackets/i)).toBeInTheDocument();
    });
  });
});
