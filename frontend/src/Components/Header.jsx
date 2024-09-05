import { useState } from 'react';
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { loginService } from "./services/login.service.js";
import { useAuth } from "../Contexts/AuthContext.jsx";

function Header(props) {
  const { isLogged, setIsLogged, employee } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const logOut = () => {
    loginService.logOut();
    setIsLogged(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="main-header bg-white shadow-md">
      {/* Top Header */}
      <div className="header-top bg-gray-800 text-white py-2">
        <div className="auto-container flex justify-between">
          <div className="left-column">
            <div className="text">Enjoy the Best while we fix your car</div>
            <div className="office-hour">Monday - Saturday 7:00AM - 6:00PM</div>
          </div>
          <div className="right-column flex items-center">
            {isLogged ? (
              <div className="link-btn">
                <div className="phone-number">
                  <strong>Welcome {employee?.employee_first_name}</strong>
                </div>
              </div>
            ) : (
              <div className="phone-number">
                Schedule Appointment: <strong>1800 456 7890</strong>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upper Header */}
      <div className="header-upper py-4">
        <div className="auto-container flex items-center justify-between">
          <div className="logo-box">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Logo" className="w-32 h-auto" />
              </Link>
            </div>
          </div>
          <div className="right-column flex items-center">
            <div className="nav-outer">
              <div className="mobile-nav-toggler lg:hidden cursor-pointer" onClick={toggleMobileMenu}>
                <img src="assets/images/icons/icon-bar.png" alt="Menu" />
              </div>
              <nav className="main-menu hidden lg:flex">
                <ul className="navigation flex space-x-4">
                  <li className="dropdown">
                    <Link to="/" className="hover:text-blue-500">Home</Link>
                  </li>
                  <li className="dropdown">
                    <Link to="/about" className="hover:text-blue-500">About Us</Link>
                  </li>
                  <li className="dropdown">
                    <Link to="/services" className="hover:text-blue-500">Services</Link>
                  </li>
                  <li>
                    <Link to="/contact" className="hover:text-blue-500">Contact Us</Link>
                  </li>
                </ul>
              </nav>
            </div>
            {isLogged ? (
              <div className="link-btn ml-4">
                <Link
                  to="/"
                  className="theme-btn btn-style-one blue"
                  onClick={logOut}
                >
                  Log out
                </Link>
              </div>
            ) : (
              <div className="link-btn ml-4">
                <Link to="/login" className="theme-btn btn-style-one">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu lg:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <div className="menu-backdrop" onClick={toggleMobileMenu}></div>
        <div className="close-btn" onClick={toggleMobileMenu}>
          <span className="icon flaticon-remove"></span>
        </div>
        <nav className="menu-box">
          <div className="nav-logo">
            <Link to="/">
              <img src="assets/images/logo-two.png" alt="Logo" title="" />
            </Link>
          </div>
          <div className="menu-outer">
            <ul className="navigation">
              <li className="dropdown">
                <Link to="/" className="hover:text-blue-500">Home</Link>
              </li>
              <li className="dropdown">
                <Link to="/about" className="hover:text-blue-500">About Us</Link>
              </li>
              <li className="dropdown">
                <Link to="/services" className="hover:text-blue-500">Services</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-500">Contact Us</Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
