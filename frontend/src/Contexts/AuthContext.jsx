import React, { useState, useEffect, useContext } from "react";

// Create a context object
const AuthContext = React.createContext();

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isEmployee, setIsEmployee] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [customer, setCustomer] = useState(null);

  // Function to check localStorage and update the auth state
  useEffect(() => {
    const storedEmployee = localStorage.getItem("employee");
    const storedCustomer = localStorage.getItem("customer");

    if (storedEmployee) {
      const parsedEmployee = JSON.parse(storedEmployee);
      console.log("Parsed Employee:", parsedEmployee); 
      setIsLogged(true);

      // Check if the employee is an admin
      if (parsedEmployee.employee_role === 3) {
        setIsAdmin(true);
        console.log("User is an Admin."); 
      }

      // Check if the employee is a regular employee
      if (parsedEmployee.employee_role === 1) {
        setIsEmployee(true);
        console.log("User is a Regular Employee."); 
      }

      // Store the employee token (if needed)
      localStorage.setItem("employee_token", parsedEmployee.employee_token);
      setEmployee(parsedEmployee);
    } else if (storedCustomer) {
      const parsedCustomer = JSON.parse(storedCustomer);
      console.log("Parsed Customer in AuthContext:", parsedCustomer);
      setIsLogged(true);
      localStorage.setItem("customer_token", parsedCustomer.customer_token);
      setCustomer(parsedCustomer);
    } else {
      // Clear the state if no user is logged in
      console.log("No employee or customer found in localStorage."); 
      setIsLogged(false);
      setEmployee(null);
      setCustomer(null);

      // Optionally clear tokens
      localStorage.removeItem("employee_token");
      localStorage.removeItem("customer_token");
    }
  }, []);

  // Provide the context value for other components
  const value = {
    isLogged,
    isAdmin,
    isEmployee,
    setIsAdmin,
    setIsLogged,
    employee,
    customer,
    setEmployee,
    setCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
