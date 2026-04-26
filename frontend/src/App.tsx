import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* When the URL is "/", show the Landing page */}
        <Route path="/" element={<Landing />} />
        
        {/* When the URL is "/login", show the Login page */}
        <Route path="/login" element={<Login />} />
        
        {/* When the URL is "/register", show the Register page */}
        <Route path="/register" element={<Register />} />

        {/* When the URL is "/verify-email/:token", show the VerifyEmail page */}
        <Route path="/verify-email/:token" element={<VerifyEmail />} />

        {/* Future route for Dashboard after login */}
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Router>
  );
}

export default App;
