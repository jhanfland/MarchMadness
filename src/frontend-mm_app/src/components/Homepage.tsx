import { useNavigate } from 'react-router-dom'; // Using react-router's useNavigate
import './Homepage.css'; // Import the CSS file

export function Homepage() {
  const navigate = useNavigate(); // Initialize navigate from useNavigate

  const navigateToSignup = () => {
    navigate('/signup'); // Redirect to the signup page
  };

  const navigateToLogin = () => {
    navigate('/login'); // Redirect to the login page
  };

  return (
    <div className="homepage"> 
      <div className="overlay"></div> 
      <div className="content"> 
        <h1>Welcome to Our March Madness Sports Betting Platform</h1>
        <div className="flex gap-4">
          <button
            onClick={navigateToSignup}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Go to Signup
          </button>
          <button
            onClick={navigateToLogin}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
}
