import { render, screen, fireEvent } from '@testing-library/react';
import { LoginForm } from '../Login-Form';
import { describe, it, expect } from 'vitest';

// Test for Login form
describe('LoginForm Component', () => {

  // Test surrounding form element
  it('renders Login form and ensures functionality', () => {
    render(<LoginForm />);

    // Check if the form elements are rendered.
    const emailInput = screen.getByLabelText("Email");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole('button');

    // Simulate user input and form submission
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Check that inputs have the correct values
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });
});
