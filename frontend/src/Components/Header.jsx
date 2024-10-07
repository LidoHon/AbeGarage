import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { loginService } from "./services/login.service.js";
import { useAuth } from "../Contexts/AuthContext.jsx";

function Header() {
  const {
    isLogged,
    setIsLogged,
    employee,
    customer,
    setEmployee,
    setCustomer,
  } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userType, setUserType] = useState(""); 
  const navigate = useNavigate();

  // *Sync state with localStorage on mount and user changes*
  useEffect(() => {
    const updateUserState = () => {
      const storedEmployee = JSON.parse(localStorage.getItem("employee"));
      const storedCustomer = JSON.parse(localStorage.getItem("customer"));

      if (storedEmployee) {
        setEmployee(storedEmployee);
        setUserType("employee");
        setIsLogged(true);
      } else if (storedCustomer) {
        setCustomer(storedCustomer);
        setUserType("customer");
        setIsLogged(true);
      } else {
        setIsLogged(false);
      }
    };

    updateUserState();

    // Listen for changes to localStorage to sync state dynamically
    window.addEventListener("storage", updateUserState);

    return () => {
      window.removeEventListener("storage", updateUserState);
    };
  }, [setEmployee, setCustomer, setIsLogged]);

  // Re-render when employee or customer state changes
  useEffect(() => {
    if (employee) setUserType("employee");
    if (customer) setUserType("customer");
  }, [employee, customer]);

  // Handle logout with state and localStorage reset
  const logOut = () => {
    loginService.logOut();
    setIsLogged(false);
    setEmployee(null);
    setCustomer(null);
    setUserType("");
    localStorage.removeItem("employee");
    localStorage.removeItem("customer");
    navigate("/"); 
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isAdmin = employee && employee.employee_role === 3;

  const handleProfileNavigation = () => {
    if (employee && employee.employee_role === 1) {
      // Navigate to the employee profile page only if employee_role is 1 
      navigate(`/admin/employee-profile/${employee.employee_id}`);
    } else if (customer) {
      // Navigate to the customer profile page
      navigate(`/admin/customer-profile/${customer.customer_id}`);
    } 
  };
  

  return (
    <header className="main-header bg-white shadow-md">
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
                <div
                  className="phone-number flex items-center gap-2 cursor-pointer"
                  onClick={employee?.employee_role === 1 || customer ? handleProfileNavigation : undefined}>
                  <strong>
                    Welcome{" "}
                    {userType === "employee"
                      ? employee?.employee_first_name
                      : customer?.customer_first_name}
                  </strong>
                </div>
              </div>
            ) : (
              <div className="flex items-center">
                <span>Call Abe:</span>
                <span className="font-bold text-xl pl-4">555 555 555</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="header-upper py-0">
        <div className="flex items-center justify-between pl-4 pr-10">
          <div className="logo-box">
            <Link to="/">
              <img src={logo} alt="Logo" className="w-40 h-10" />
            </Link>
          </div>
          <div className="flex items-center">
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
              <ul className="navigation flex flex-col lg:flex-row lg:space-x-4 ">
                <li>
                  <Link to="/" className="hover:text-blue-500 no-underline">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-blue-500 no-underline">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-blue-500 no-underline">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-blue-500 no-underline">
                    Contact Us
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin/admin-landing"
                      className="hover:text-blue-500 no-underline"
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
                {isLogged ? (
                  <li>
                    <button
                      onClick={logOut}
                      className="hover:text-blue-500 bg-blue-950 text-white hover:bg-gray-700 px-4 py-2.5 no-underline"
                    >
                      LOG OUT
                    </button>
                  </li>
                ) : (
                  <li>
                    <Link
                      to="/login"
                      className="hover:text-red-500 bg-red-600 text-white hover:bg-red-500 px-4 py-2.5 no-underline"
                    >
                      SiGN IN
                    </Link>
                  </li>
                )}
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;