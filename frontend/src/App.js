import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
import './App.css';
import { account } from './appwrite-config';
import SignUp from './components/SignUp'
import Login from './components/Login';
import Profile from './components/Profile';
import ForgotPassword from './components/ForgotPassword';
import NewPassword from './components/NewPassword';
import OtpVerification from './otp/OtpVerification';

function App() { 
  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      console.log('Logged out successfully');
      // Optionally, redirect to the login page
    } catch (error) {
      console.error('Logout error', error);
    }
  };

  return ( 
    <Router>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={handleLogout}>Logout</button>
          <nav>
            <Link to="/signup">Sign Up</Link> |
            <Link to="/login">Login</Link> |
            <Link to="/profile">Profile</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<NewPassword />} />
          <Route path="/otp-verification" element={<OtpVerification />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

// --- a/frontend/src/Login.js
// +++ b/frontend/src/Login.js

