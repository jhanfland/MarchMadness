import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Check for token on component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [location]);

  // Sign out handler removes token and navigates to home
  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("passwordLength");
    setToken(null);
    navigate("/");
  };

  return (
    <div className="flex w-full py-4 px-5 items-center">
      <div className="bg-blue-600 ml-8 w-16 h-16 rounded-full" />
      <div className="ml-auto flex gap-20 mr-1 p-2 font-medium items-center">
        <Link to="/">Home</Link>
        <Link to="/liveBracket">Live Bracket</Link>
        <Link to="/bracket">My Brackets</Link>
        <Link to="/scores">Scores</Link>
        <Link to="/account">My Account</Link>
        {token ? (
          <button
            onClick={handleSignOut}
            className="border rounded-md px-7 py-2 font-bold hover:border-blue-700"
          >
            SIGN OUT
          </button>
        ) : (
          <Link
            to="/login"
            className="border rounded-md px-7 py-2 font-bold hover:border-blue-700"
          >
            LOG IN
          </Link>
        )}
      </div>
    </div>
  );
}
