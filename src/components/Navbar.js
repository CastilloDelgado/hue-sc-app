import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "../contexts/AppContext";

const Navbar = () => {
  const { pathname } = useLocation();
  const { darkMode, setDarkMode } = useApp();

  const handleDarkModeChange = (e) => setDarkMode(e.target.checked);

  return (
    <nav
      className={`navbar sticky-top navbar-expand-lg ${
        darkMode ? "navbar-dark bg-dark" : "navbar-light bg-light"
      }`}
    >
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          Hue Show Creator
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/home"
                className={`nav-link ${pathname.includes("home") && "active"}`}
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/setup"
                className={`nav-link ${pathname.includes("setup") && "active"}`}
                aria-current="page"
              >
                Setup
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/devices"
                className={`nav-link ${
                  pathname.includes("devices") && "active"
                }`}
                aria-current="page"
              >
                Devices
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/animations"
                className={`nav-link ${
                  pathname.includes("animations") && "active"
                }`}
                aria-current="page"
              >
                Animations
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/dragdropexample"
                className={`nav-link ${
                  pathname.includes("dragdropexample") && "active"
                }`}
                aria-current="page"
              >
                Drag & Drop Example
              </Link>
            </li>
            <li className="nav-item">
              <div className="form-check form-switch d-flex d-lg-none">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="darkModeSwitch"
                  onChange={handleDarkModeChange}
                  checked={darkMode}
                />
                <label
                  className={`form-check-label ms-2 ${
                    darkMode && "text-white"
                  }`}
                  htmlFor="darkModeSwitch"
                >
                  Dark mode
                </label>
              </div>
            </li>
          </ul>
        </div>
        <form className="d-lg-flex d-none">
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              id="darkModeSwitch"
              onChange={handleDarkModeChange}
              checked={darkMode}
            />
            <label
              className={`form-check-label ${darkMode && "text-white"}`}
              htmlFor="darkModeSwitch"
            >
              Dark mode
            </label>
          </div>
        </form>
      </div>
    </nav>
  );
};

export default Navbar;
