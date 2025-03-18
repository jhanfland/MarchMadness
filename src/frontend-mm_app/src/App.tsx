import axios from "axios";
import { useEffect, useState } from 'react';
import './App.css';
import { Homepage } from './components/Homepage';
import { SignupForm } from './components/Signup-Form'; // ADDED: Import SignupForm
import { LoginForm } from './components/Login-Form';   // ADDED: Import LoginForm
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importing react-router

// Main App component with React Router integrated
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </Router>
  );
}

export default App;
