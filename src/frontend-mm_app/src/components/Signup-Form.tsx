import { ShoppingBasket } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FormEvent, useRef } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useNavigate } from 'react-router-dom';
// import axios from "axios"

export function SignupForm () {
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
    

    /** Will Need To Update once backend API endpoints are set for POST auth/register */

    console.log(email);
    console.log(password);

    try {
      // Make the POST request using axios
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      // Handle success response using Alert
      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }
      alert("Signup successful!");
      // Redirect user to home page
    } catch (error: any) {
      // Handle error response
      console.error("Signup failed:", error);
      // Show an error message or alert to the user
      alert(error.message); // Show the actual error message
    }
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
        <h1 className="text-xl font-bold">Create an account</h1>
        <div className="text-center text-sm">
          Already have an account?{" "}
          <a onClick={() => navigate('/login')} className="underline underline-offset-4">
            Sign in
          </a>
        </div>
      </div>
    )
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
        Sign Up
      </Button>
      </div>
    )
  }

  // contains policies of app via link popover
  const agreementText = () => {
    return (
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary ">
          By clicking continue, you agree to our {" "}
          <Popover>
            <PopoverTrigger asChild><a href="#">Terms of Service</a></PopoverTrigger>
            <PopoverContent>
              <div className="space-y-4">
              <h2 className="text-lg font-bold">Terms of Service</h2>
                <p className="text-sm">
                  By using our platform, you agree to our terms and policies.
                </p>
                <p className="text-sm">
                  We may update these terms, and continued use means you accept any changes.
                </p>
                <p className="text-sm">
                  You agree to use the platform responsibly. We may suspend or terminate your access for violations.
                </p>
              </div>
            </PopoverContent>
          </Popover>
          {" "} and {" "}
          <Popover>
            <PopoverTrigger asChild><a href="#">Privacy Policy</a></PopoverTrigger>
            <PopoverContent>
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Privacy Policy</h2>
                <p className="text-sm">
                  We value your privacy and are committed to protecting your personal data.
                </p>
                <p className="text-sm">
                  Your data is used to improve your experience and may be shared with trusted partners.
                </p>
                <p className="text-sm">
                  You can control your data preferences through your account settings.
                </p>
              </div>
            </PopoverContent>
          </Popover>
          .
      </div>
    )
  }

  return (
    <div className={cn("flex flex-col gap-6")}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          {header()}
          {inputBody()}
          <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          </div>
          {agreementText()}
        </div>
      </form>
    </div>
  )
}
