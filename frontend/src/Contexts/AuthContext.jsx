// Import React and the Hooks we need here
import React, { useState, useEffect, useContext } from "react";
// Import the Util function we created to handle the reading from the local storage
import getAuth from "../Components/util/auth";
/// Create a context object
const AuthContext = React.createContext();

// Create a custom hook to use the context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const loggedInEmployee = await getAuth();
        if (loggedInEmployee?.employee_token) {
          setIsLogged(true);
          // 3 is the employee_role for admin
          if (loggedInEmployee.employee_role === 3) {
            setIsAdmin(true);
          }
          setEmployee(loggedInEmployee);
        }
      } catch (error) {
        console.error("Error fetching auth data:", error);
      }
    };

    fetchAuth();
  }, []);

  const value = { isLogged, isAdmin, setIsAdmin, setIsLogged, employee };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};