import { render, screen, fireEvent } from "@testing-library/react";
import { SignupForm } from "../../Pages/Signup-Form";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";

// Test for Sign up form
describe("SignupForm Component", () => {
  // Test surrounding form element
  it("renders Signup form and ensures functionality", () => {
    render(
      <MemoryRouter>
        <SignupForm />
      </MemoryRouter>
    );

    // Ensures popover links are present
    fireEvent.click(screen.getByText(/terms of service/i));
    fireEvent.click(screen.getByText(/privacy policy/i));

    // Check if the form elements are rendered. WILL NEED TO UPDATE AFTER BACKEND TESTS
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button");

    // Simulate user input and form submission
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    // Check that inputs have the correct values
    expect(emailInput).toHaveValue("test@example.com");
    expect(passwordInput).toHaveValue("password123");
  });
});
