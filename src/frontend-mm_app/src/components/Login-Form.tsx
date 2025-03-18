import { ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useRef } from "react";
import { useNavigate } from 'react-router-dom';
// This file follows a similar structure to the Signup Form

export function LoginForm () {
  // Tracks email and password from input
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  // Form Submission Handler
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    // Access the values from the refs
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    

    /** Will Need To Update once backend API endpoints are set for POST auth/login */

    // console.log(email);
    // console.log(password);

    // try {
    //   // Make the POST request using axios
    //   const response = await axios.post("/api/login", { email, password });
    //   // Handle success response using Alert
    //   console.log("Login successful:", response.data);
    //   // Redirect user to home page
    // } catch (error) {
    //   // Handle error response
    //   console.error("Login failed:", error);
    //   // Show an error message or alert to the user
    //   alert("An error occurred. Please try again.");
    // }
  }

  // functions for sections of code

  // contains header icon and text prior to input
  const header = () => {
    return (
      <div className="flex flex-col items-center gap-2">
        <a
          href="#"
          className="flex flex-col items-center gap-2 font-medium"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-md">
            <ShoppingBasket className="size-6" />
          </div>
          <span className="sr-only"></span>
        </a>
        <h1 className="text-xl font-bold">Welcome Back</h1>
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <a onClick={() => navigate('/signup')} className="underline underline-offset-4">
            Sign Up
          </a>
        </div>
      </div>
    );
  }

  // contains label, inputs, and button to submit form
  const inputBody = () => {
    return (
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="q@example.com"
            ref={emailRef}
            required
          />
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            ref={passwordRef}
            required
          />
        </div>
        <Button type="submit" className="w-full">
          Log In
        </Button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          {header()}
          {inputBody()}
        </div>
      </form>
    </div>
  );
}
