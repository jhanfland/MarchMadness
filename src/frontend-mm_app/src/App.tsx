import { SignupForm } from './Pages/Signup-Form'; // ADDED: Import SignupForm
import { LoginForm } from './Pages/Login-Form';   // ADDED: Import LoginForm
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom'; // Importing react-router
import BracketPage from "./Pages/Bracket/BracketPage";
import Navbar from './components/navbar';
import Homepage from './Pages/Homepage';
import LiveBracketPage from './Pages/Bracket/LiveBracketPage';
import Chatbot from './components/Chatbot';
import { LiveScoresPage } from './Pages/LiveScoresPage';
import AccountPage from './Pages/AccountPage';

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
        <Route path="/liveBracket" element={<LiveBracketPage />} />
        <Route path="/scores" element={<LiveScoresPage />} />
        <Route path="/account" element={<AccountPage />} />
      </Routes>
      <Chatbot />
    </Router>
  );
}

export default App;
