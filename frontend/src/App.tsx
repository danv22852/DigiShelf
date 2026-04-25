import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

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
      </Routes>
    </Router>
  );
}

export default App;
