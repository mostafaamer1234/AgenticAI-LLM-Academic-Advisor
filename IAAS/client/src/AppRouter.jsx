import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard'; // Student Dashboard
import FacultyDashboard from './pages/FacultyDashboard'; // Faculty Dashboard
import AdminDashboard from './pages/AdminDashboard'; // Admin Dashboard
import Profile from './pages/Profile'; // Profile page
import LoginPage from './pages/LoginPage'; // Login page
import Navbar from './components/Navbar'; // Shared Navbar

const AppRouter = () => {
  const [user, setUser] = useState(null); // State to track logged-in user

  const handleLogin = (credentials) => {
    setUser(credentials); // Set the user after login
  };

  const handleLogout = () => {
    setUser(null); // Clear the user on logout
  };

  return (
    <Router>
      {/* Render Navbar only if the user is logged in */}
      {user && <Navbar user={user} onLogout={handleLogout} />}
      <Routes>
        {/* Login Route */}
        <Route
          path="/"
          element={
            user ? (
              user.role === 'student' ? (
                <Dashboard />
              ) : user.role === 'faculty' ? (
                <FacultyDashboard />
              ) : user.role === 'admin' ? (
                <AdminDashboard />
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />

        {/* Profile Route */}
        <Route
          path="/profile"
          element={
            user ? (
              <Profile />
            ) : (
              <Navigate to="/" />
            )
          }
        />

        {/* Catch-All Route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;