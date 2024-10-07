import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";  // Import useNavigate
import Avatar from "react-avatar";
import logo from "../assets/images/logo.png";
import { loginService } from "./services/login.service.js";
import { useAuth } from "../Contexts/AuthContext.jsx";
import getAuth from "./util/auth.js";

function Header(props) {
  const {
    isLogged,
    setIsLogged,
    employee,
    customer,
    setEmployee,
    setCustomer,
  } = useAuth();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const navigate = useNavigate();  

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = await getAuth();
      if (loggedInUser) {
        if (loggedInUser.employee_id) {
          setEmployee(loggedInUser);
        } else {
          setCustomer(loggedInUser);
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
    navigate("/");
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

  return (
    <header className="main-header bg-white shadow-md">
      {/* Top Header */}
      <div className="header-top bg-gray-800 text-white py-0">
        <div className="flex justify-between pr-10">
          <div className="left-column">
            <div className="text">Enjoy the Best while we fix your car</div>
            <div className="office-hour hidden md:block">
              Monday - Saturday 7:00AM - 6:00PM
            </div>
          </div>
          <div className="right-column flex items-center">
            {isLogged ? (
              <div className="link-btn flex items-center">
                <div className="phone-number flex items-center gap-2">
                  <strong onClick={toggleDropdown} className="cursor-pointer">
                    Welcome{" "}
                    {employee
                      ? employee.employee_first_name
                      : customer?.customer_first_name}
                  </strong>
                  <div className="relative">
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
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center">
                  <span>Call Abe:</span>
                  <span className="font-bold text-xl pl-4">555 555 555</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upper Header */}
      <div className="header-upper py-0">
        <div className=" flex items-center justify-between pl-4 pr-10">
          <div className="logo-box">
            <div className="logo">
              <Link to="/">
                <img src={logo} alt="Logo" className="w-40 h-10" />
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
              <ul className="navigation flex flex-col lg:flex-row lg:space-x-4">
                <li className="dropdown">
                  <Link
                    to="/"
                    style={{ textDecoration: "none" }}
                    className="hover:text-blue-500 "
                  >
                    Home
                  </Link>
                </li>
                <li className="dropdown">
                  <Link
                    to="/about"
                    style={{ textDecoration: "none" }}
                    className="hover:text-blue-500"
                  >
                    About Us
                  </Link>
                </li>
                <li className="dropdown">
                  <Link
                    to="/services"
                    style={{ textDecoration: "none" }}
                    className="hover:text-blue-500"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contact"
                    style={{ textDecoration: "none" }}
                    className="hover:text-blue-500"
                  >
                    Contact Us
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/admin/admin-landing"
                      className="hover:text-blue-500"
                    >
                      Admin
                    </Link>
                  </li>
                )}
                <li>
                  <div
                    style={{
                      width: "2px",
                      backgroundColor: "gray",
                      height: "30px",
                      margin: "0 8px",
                    }}
                  ></div>
                </li>
                {isLogged && (
                  <>
                    <li>
                      <button
                        onClick={logOut}
                        className="hover:text-blue-500 bg-blue-950 text-white hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium  text-sm px-4 py-2.5 text-center dark:bg-blue-950 dark:hover:bg-blue-950 dark:focus:ring-blue-800"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                )}
                {!isLogged && (
                  <>
                    <Link
                      style={{ textDecoration: "none" }}
                      to="/login"
                      className="hover:text-red-500 bg-red-600 text-white hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium  text-sm px-4 py-2.5 text-center dark:bg-red-600 "
                    >
                      Login
                    </Link>
                  </>
                )}
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
              {isAdmin && (
                <li>
                  <Link
                    to="/admin/admin-landing"
                    className="hover:text-blue-500"
                  >
                    Admin
                  </Link>
                </li>
              )}
              {isLogged && (
                <li>
                  <button
                    onClick={logOut}
                    className="hover:text-blue-500 bg-black text-white hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    Logout
                  </button>
                </li>
              )}
              {!isLogged && (
                <div>
                  <Link
                    style={{ textDecoration: "none" }}
                    to="/login"
                    className=" p-[12px] bg-red-600 text-white font-semibold underline-none rounded-md hover:bg-red-700"
                  >
                    Login
                  </Link>
                </div>
              )}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Header;
