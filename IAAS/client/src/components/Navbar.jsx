import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleDashboardNavigation = () => {
    // Navigate to the correct dashboard based on user role
    if (user.role === 'student') {
      navigate('/dashboard');
    } else if (user.role === 'faculty') {
      navigate('/faculty-dashboard');
    } else if (user.role === 'admin') {
      navigate('/admin-dashboard');
    }
  };

  const handleProfileNavigation = () => {
    navigate('/profile'); // Navigate to the Profile page
  };

  return (
    <nav className="navbar">
      <h1>Intelligent Academic Advising System</h1>
      <ul className="nav-links">
        <li>
          <button onClick={handleDashboardNavigation} className="dashboard-button">
            Dashboard
          </button>
        </li>
        <li>
          <button onClick={handleProfileNavigation} className="profile-button">
            Profile
          </button>
        </li>
        <li>
          <button onClick={onLogout} className="logout-button">
            Logout
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
