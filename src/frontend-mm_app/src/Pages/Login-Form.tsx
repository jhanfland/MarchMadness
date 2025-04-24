import { ShoppingBasket } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import errorAnimation from "../../public/errorAnimation.json"

export function LoginForm() {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // State for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      const response = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      localStorage.setItem("token", data.token);
      navigate("/");
      localStorage.setItem("passwordLength", password.length.toString());
      navigate("/");
    } catch (error: any) {
      console.error("Login failed:", error);
      setError("Login Failed")
    }
  };

  // Header content
  const header = () => (
    <div className="flex flex-col items-center gap-2">
      <a href="#" className="flex flex-col items-center gap-2 font-medium">
        <div className="flex h-8 w-8 items-center justify-center rounded-md">
          <ShoppingBasket className="size-6" />
        </div>
      </a>
      <h1 className="text-xl font-bold">Welcome Back</h1>
      <div className="text-center text-sm">
        Don't have an account?{" "}
        <a
          onClick={() => navigate("/signup")}
          className="underline underline-offset-4 cursor-pointer"
        >
          Sign Up
        </a>
      </div>
    </div>
  );

  // Input + submit button
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
        />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type={showPassword ? "text" : "password"} // Toggle input type
          placeholder="Enter your password"
          ref={passwordRef}
          required
        />
      </div>

      {/* Show Password Toggle */}
      <div className="flex items-center gap-3">
        <Input
          id="showPass"
          type="checkbox"
          className="h-4 w-4"
          onChange={() => setShowPassword((prev) => !prev)}
          checked={showPassword}
        />
        <Label htmlFor="showPass" className="w-max"> Show Password </Label>
      </div>

      

      <Button type="submit" className="w-full">
        Log In
      </Button>

      {error ? <div className="text-red-500 flex gap-3 align-center">
        <Lottie
            animationData={errorAnimation}
            loop={false}
            className="w-[30px]"
          />
         <p className="mt-0.5"> {error} </p> 
         </div> : <></>}
    </div>
  );

  return (
    <div className="max-w-[500px] m-auto mt-20">
      <div className={cn("flex flex-col gap-6")}>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            {header()}
            {inputBody()}
          </div>
        </form>
      </div>
    </div>
  );
}
