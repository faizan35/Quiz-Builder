import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/authSlice";
import logoImage from "../../assets/image/logo.png";
import "./NavBar.css";

function NavBar() {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false); // State for mobile menu

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setDropdownVisible(!dropdownVisible);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen); // Toggle mobile menu
  };

  const handleLogout = () => {
    dispatch(logout());
    sessionStorage.clear();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const clearSession = () => {
    sessionStorage.clear();
  };

  useEffect(() => {
    const closeDropdown = () => {
      setDropdownVisible(false);
    };

    document.addEventListener("click", closeDropdown);

    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/" onClick={clearSession}>
          <img src={logoImage} alt="Logo" className="logo-image" />
        </Link>
      </div>
      <div className="mobile-menu-toggle" onClick={toggleMobileMenu}>
        ☰
      </div>
      <ul className={`navbar-links ${mobileMenuOpen ? 'show' : ''}`}>
        <li>
          <Link to="/" onClick={clearSession}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/about" onClick={clearSession}>
            About
          </Link>
        </li>
        <li>
          <Link to="/contact" onClick={clearSession}>
            Contact
          </Link>
        </li>
        <li>
          <Link to="/how-to" onClick={clearSession}>
            HowToPage
          </Link>
        </li>
        
        {auth.isAuthenticated ? (
          <li onClick={toggleDropdown}>
            <div className="user-icon">
              <i className="fas fa-user-circle"></i>  {/* Font Awesome user icon */}
            </div>
            {dropdownVisible && (
              <ul className="dropdown-menu">
                <li>
                  <Link to="/dashboard" onClick={clearSession}>
                    Dashboard
                  </Link>
                </li>
                <li>
                  <a href="/" onClick={handleLogout}>
                    Logout
                  </a>
                </li>
              </ul>
            )}
          </li>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default NavBar;
