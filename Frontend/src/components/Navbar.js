import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';  // ✅ Fixed path

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg " style={{ height: "60px", position: "fixed", width: "100%", top: "0", zIndex: "1000","background-color": "#597D35",color: "white"  }}>
      <div className="container-fluid text-white">
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/" className="nav-link text-white">Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/about" className="nav-link text-white">About</Link>
            </li>
          </ul>

          <ul className="navbar-nav mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/login" className="nav-link text-white">Login</Link>
            </li>
            <li className="nav-item">
              <Link to="/signup" className="nav-link text-white">Signup</Link>
            </li>
            
            
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;