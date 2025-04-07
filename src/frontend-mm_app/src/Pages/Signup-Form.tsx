import { ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../../public/errorAnimation.json";

export function SignupForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await fetch("http://localhost:8000/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Signup failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (error: any) {
      console.error("Signup failed:", error);
      setError(error.message);
    }
  };

  const header = () => (
    <div className="flex flex-col items-center gap-2">
      <a href="#" className="flex flex-col items-center gap-2 font-medium">
        <div className="flex h-8 w-8 items-center justify-center rounded-md">
          <ShoppingBasket className="size-6" />
        </div>
      </a>
      <h1 className="text-xl font-bold">Create an account</h1>
      <div className="text-center text-sm">
        Already have an account?{" "}
        <a
          onClick={() => navigate("/login")}
          className="underline underline-offset-4 hover:cursor-pointer"
        >
          Sign in
        </a>
      </div>
    </div>
  );

  const inputBody = () => (
    <div className="flex flex-col gap-6">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="q@example.com"
          ref={emailRef}
          required
          onFocus={() => setError("")}
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          ref={passwordRef}
          required
          onFocus={() => setError("")}
        />
      </div>

      <div className="flex items-center gap-3">
        <Input
          id="showPass"
          type="checkbox"
          className="h-4 w-4"
          onChange={() => setShowPassword((prev) => !prev)}
          checked={showPassword}
        />
        <Label htmlFor="showPass" className="w-max">
          Show Password
        </Label>
      </div>

      <Button type="submit" className="w-full">
        Sign Up
      </Button>

      <div className="h-10"> 
      {error ? (
        <div className="text-red-500 flex gap-3 items-center">
          <Lottie animationData={errorAnimation} loop={false} className="w-[30px]" />
          <p className="mt-0.5">{error}</p>
        </div>
      ) : null}
      </div> 
    </div>
  );

  const agreementText = () => (
    <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary ">
      By clicking continue, you agree to our{" "}
      <Popover>
        <PopoverTrigger asChild>
          <a href="#">Terms of Service</a>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Terms of Service</h2>
            <p className="text-sm">
              By using our platform, you agree to our terms and policies.
            </p>
            <p className="text-sm">
              We may update these terms, and continued use means you accept any
              changes.
            </p>
            <p className="text-sm">
              You agree to use the platform responsibly. We may suspend or
              terminate your access for violations.
            </p>
          </div>
        </PopoverContent>
      </Popover>{" "}
      and{" "}
      <Popover>
        <PopoverTrigger asChild>
          <a href="#">Privacy Policy</a>
        </PopoverTrigger>
        <PopoverContent>
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Privacy Policy</h2>
            <p className="text-sm">
              We value your privacy and are committed to protecting your
              personal data.
            </p>
            <p className="text-sm">
              Your data is used to improve your experience and may be shared
              with trusted partners.
            </p>
            <p className="text-sm">
              You can control your data preferences through your account
              settings.
            </p>
          </div>
        </PopoverContent>
      </Popover>
      .
    </div>
  );

  return (
    <div className="auth-container max-w-[500px] m-auto mt-20">
      <div className={cn("flex flex-col gap-6")}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {header()}
            {inputBody()}
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border" />
            {agreementText()}
          </div>
        </form>
      </div>
    </div>
  );
}
