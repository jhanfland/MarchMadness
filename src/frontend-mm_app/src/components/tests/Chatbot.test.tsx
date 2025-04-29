import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Chatbot from "@/components/Chatbot";

// Mock the scrollTo functionality
const mockScrollTo = vi.fn();
Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  value: mockScrollTo,
  writable: true
});

describe("Chatbot", () => {
  beforeEach(() => {
    // Clear the mock before each test
    mockScrollTo.mockClear();
  });

  it("shows the chatbot button", () => {
    render(<Chatbot />);
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("opens the chatbot when button is clicked", () => {
    render(<Chatbot />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText("Chatbot")).toBeInTheDocument();
  });

  it("shows the welcome message", () => {
    render(<Chatbot />);
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(screen.getByText(/Hi there! My name is Cooper/i)).toBeInTheDocument();
  });
}); 
