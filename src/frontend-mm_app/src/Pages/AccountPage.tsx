import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AccountPage() {
  const [currentEmail, setCurrentEmail] = useState("");
  const [passwordMask, setPasswordMask] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const length = localStorage.getItem("passwordLength");

    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    setIsLoggedIn(true);

    fetch("http://localhost:8000/auth/get-user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setCurrentEmail(data.email);

        if (length) {
          setPasswordMask("*".repeat(parseInt(length)));
        } else {
          setPasswordMask("********");
        }
      });
  }, []);

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (file) formData.append("profile_picture", file);

    const res = await fetch("http://localhost:8000/auth/update-profile", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    const result = await res.json();

    if (res.ok) {
      alert("Account updated");

      // update current info if email was changed
      if (email !== currentEmail && email.trim() !== "") {
        setCurrentEmail(email);
      }

      // update password new password was submitted
      if (password.length > 0) {
        setPasswordMask("*".repeat(password.length));
        localStorage.setItem("passwordLength", password.length.toString());
      }

      setEmail("");
      setPassword("");
      setFile(null);
      setStatus("");
    } else {
      setStatus(result.error || "Update failed");
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
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Update Email"
          className="bg-neutral-800 text-white placeholder-gray-400"
        />
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Update New Password"
          className="bg-neutral-800 text-white placeholder-gray-400"
        />
        <Button
          onClick={handleSave}
          className="bg-white text-black hover:bg-gray-300"
        >
          Save Changes
        </Button>
        {status && <p className="text-sm mt-2 text-red-400">{status}</p>}
      </div>
    </div>
  );
}
