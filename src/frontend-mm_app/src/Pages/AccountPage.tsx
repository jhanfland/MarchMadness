import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [passwordMask, setPasswordMask] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [success, setSuccess] = useState(""); 
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));


  // get info when login/logout
  useEffect(() => {
    const currentToken = localStorage.getItem("token");
    setToken(currentToken); // updates token
  
    if (!currentToken) {
      setIsLoggedIn(false);
      setCurrentEmail("");
      setPasswordMask("");
      setEmail("");
      setPassword("");
      setStatus("");
      setSuccess("");
      return;
    }
  
    // token = exists, user = logged in
    setIsLoggedIn(true);
  
    const length = localStorage.getItem("passwordLength");
  
    // get user info from backend
    fetch("http://localhost:8000/auth/get-user", {
      headers: {
        Authorization: `Bearer ${currentToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // set user email from backend
        setCurrentEmail(data.email);
  
        // clear all fields
        setEmail(""); 
        setPassword(""); 
        setStatus("");
        setSuccess("");
  
        if (length) {
          setPasswordMask("*".repeat(parseInt(length)));
        } else {
          setPasswordMask("********");
        }
      });
  }, [token]);

  // function handles saving updates
  const handleSave = async () => {
    const savedToken = localStorage.getItem("token"); // new token for updates
  
    // clear
    setStatus("");
    setSuccess("");
  
    // validate email
    if (email.trim() !== "") {
      if (!email.includes("@") || !/\.\w{3,}$/.test(email)) {
        setStatus("Please enter a valid email address.");
        return;
      }
      if (email.trim() === currentEmail) {
        setStatus("New email must be different from current email.");
        return;
      }
    }
  
    // send data to backend
    const formData = new FormData();
    formData.append("email", email);
    if (password) formData.append("password", password);
  
    try {
      const response = await fetch("http://localhost:8000/auth/update-profile", {
        method: "POST",
        headers: { Authorization: `Bearer ${savedToken}` },
        body: formData,
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        // handling errors
        const errorMessage = result.error || "Update failed";
        if (errorMessage.toLowerCase().includes("email already")) {
          setStatus("This email is already in use. Please choose a different one.");
        } else {
          setStatus(errorMessage);
        }
        return;
      }
  
      // success, update succesful
      setSuccess("Account updated successfully.");
      setEmail("");
      setPassword("");
      setStatus("");
  
      // refresh token and login state
      const updatedToken = localStorage.getItem("token");
      setToken(updatedToken);
  
      // update displayed user password and email
      if (email !== currentEmail && email.trim() !== "") {
        setCurrentEmail(email);
      }
      if (password.length > 0) {
        setPasswordMask("*".repeat(password.length));
        localStorage.setItem("passwordLength", password.length.toString());
      }
  
    } catch (error: any) {
      console.error("Failed to update profile:", error);
      setStatus("An unexpected error occurred.");
    }
  };
  

  // show message if not logged in
  if (!isLoggedIn) {
    return (
      <div className="text-center text-white mt-20 text-lg">
        Please log in or sign up to access your account information.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-8 text-white">
      <h2 className="text-2xl font-bold mb-2">Account Settings</h2>

      <div className="bg-zinc-900 p-4 rounded-md shadow-md space-y-2">
        <h3 className="font-semibold text-lg">Current Account Info</h3>
        <p>
          <span className="font-medium">Email:</span> {currentEmail}
        </p>
        <p>
          <span className="font-medium">Password:</span> {passwordMask}
        </p>
      </div>

      <div className="bg-zinc-900 p-4 rounded-md shadow-md space-y-4">
        <h3 className="font-semibold text-lg">Update Info</h3>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Update Email"
          className="bg-neutral-800 text-white placeholder-gray-400"
        />
        <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Update Password"
          className="bg-neutral-800 text-white placeholder-gray-400"
        />
        <Button onClick={handleSave} className="bg-white text-black hover:bg-gray-300"
        >
          Save Changes
        </Button> {status && <p className="text-sm mt-2 text-red-400">{status}</p>}
        {success && <p className="text-sm mt-2 text-green-400">{success}</p>}
      </div>
    </div>
  );
}
