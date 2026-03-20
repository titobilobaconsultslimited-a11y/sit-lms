import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userName = localStorage.getItem('userName');
  const enrollmentId = localStorage.getItem('enrollmentId');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/dashboard" className="logo">
            <span className="logo-icon">📚</span>
            <span className="logo-text">SIT LMS</span>
          </Link>

          <nav className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/courses" className="nav-link">Courses</Link>
            <Link to="/results" className="nav-link">Results</Link>
          </nav>

          <div className="user-menu">
            <div 
              className="user-profile"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <div className="avatar">{userName?.charAt(0)}</div>
              <div className="user-info">
                <div className="user-name">{userName}</div>
                <div className="enrollment-id">{enrollmentId}</div>
              </div>
              <span className={`dropdown-icon ${dropdownOpen ? 'open' : ''}`}>▼</span>
            </div>

            {dropdownOpen && (
              <div className="dropdown-menu">
                <div className="dropdown-item user-detail">
                  <strong>{userName}</strong>
                  <small>{enrollmentId}</small>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
