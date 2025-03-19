import { SignupForm } from './Pages/Signup-Form'; // ADDED: Import SignupForm
import { LoginForm } from './Pages/Login-Form';   // ADDED: Import LoginForm
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; // Importing react-router
import BracketPage from "./Pages/Bracket/BracketPage";
import Navbar from './components/navbar';
import Homepage from './Pages/Homepage';

// Main App component with React Router integrated
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/bracket" element={<BracketPage />} />
      </Routes>
    </Router>
  );
}

export default App;
