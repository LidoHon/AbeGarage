import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Avatar from "react-avatar";
import logo from "../assets/images/logo.png";
import { loginService } from "./services/login.service.js";
import { useAuth } from "../Contexts/AuthContext.jsx";
import getAuth from "./util/auth.js";
// import jwtDecode from 'jwt-decode';
function Header(props) {
  const {
    isLogged,
    setIsLogged,
    employee,
    customer,
    setEmployee,
    setCustomer,
  } = useAuth();
  // console.log(customer);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = await getAuth();
      console.log("Logged in User:", loggedInUser); 
      if (loggedInUser) {
        if (loggedInUser.employee_id) {
          setEmployee(loggedInUser);
          console.log("Employee Data:", loggedInUser); 
        } else {
          setCustomer(loggedInUser);
          console.log("Customer Data:", loggedInUser); 
        }
      }
    };
  
    fetchUserData();
  }, [setEmployee, setCustomer]);
  
  
  const logOut = () => {
    loginService.logOut();
    setIsLogged(false);
    localStorage.removeItem("employee");
    localStorage.removeItem("customer");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  const isAdmin = employee && employee.employee_role === 3;
  const isEmployee = employee && employee.employee_role === 1;

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
              <div className="link-btn flex items-center">
                <div className="phone-number flex items-center gap-2">
                  <strong>
                    Welcome{" "}
                    {employee
                      ? employee.employee_first_name
                      : customer?.customer_first_name}
                  </strong>
                  <div className="relative">
                    <div onClick={toggleDropdown} className="cursor-pointer">
                      <Avatar
                        name={
                          employee
                            ? employee.employee_first_name
                            : customer?.customer_first_name
                        }
                        size="40"
                        round={true}
                        src={employee?.profile_image || customer?.profile_image}
                      />
                    </div>
                    {isDropdownOpen && (
                      <div className="absolute right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg z-10">
                        {!isAdmin && employee && (
                          <Link
                            to={`/admin/employee-profile/${employee.employee_id}`}
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={closeDropdown}
                          >
                            Profile
                          </Link>
                        )}
                        {!isAdmin && customer && (
                          <Link
                            to={`/admin/customer-profile/${customer.customer_id}`}
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={closeDropdown}
                          >
                            Profile
                          </Link>
                        )}
                        {isAdmin && (
                          <Link
                            to="/admin/admin-landing"
                            className="block px-4 py-2 hover:bg-gray-100"
                            onClick={closeDropdown}
                          >
                            Dashboard
                          </Link>
                        )}
                        <Link
                          onClick={logOut}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                          Logout
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
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

      {/* Upper Header */}
      <div className="header-upper py-0">
        <div className="auto-container flex items-center justify-between">
          <div className="logo-box">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Logo" className="w-32 h-auto" />
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {/* Hamburger Menu Icon */}
            <div className="lg:hidden" onClick={toggleMobileMenu}>
              <button className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                {isMobileMenuOpen ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16m-7 6h7"
                    />
                  </svg>
                )}
              </button>
            </div>

            <nav
              className={`main-menu ${
                isMobileMenuOpen ? "block" : "hidden"
              } lg:flex`}
            >
              <ul className="navigation flex flex-col lg:flex-row lg:space-x-2">
                <li className="dropdown">
                  <Link to="/" className="hover:text-blue-500">
                    Home
                  </Link>
                </li>
                <li className="dropdown">
                  <Link to="/about" className="hover:text-blue-500">
                    About Us
                  </Link>
                </li>
                <li className="dropdown">
                  <Link to="/services" className="hover:text-blue-500">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-500">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mobile-menu lg:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        }`}
      >
        <nav className="menu-box">
          <div className="menu-outer">
            <ul className="navigation">
              <li className="dropdown">
                <Link to="/" className="hover:text-blue-500">
                  Home
                </Link>
              </li>
              
              <li className="dropdown">
                <Link to="/about" className="hover:text-blue-500">
                  About Us
                </Link>
              </li>
              <li className="dropdown">
                <Link to="/services" className="hover:text-blue-500">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-blue-500">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;