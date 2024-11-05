import { useState, useEffect } from "react";
import { Navigate } from "react-router";
import getAuth from "../util/auth";

const PrivateAuthRoute = ({ roles, children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const loggedInUser = await getAuth();
        console.log("Logged in user:", loggedInUser);

        if (loggedInUser) {
          if (loggedInUser.employee_token) {
            setIsLogged(true);
            console.log("User role:", loggedInUser.employee_role);

            if (roles && roles.includes(loggedInUser.employee_role)) {
              console.log("Authorization success: User role matches required roles.");
              setIsAuthorized(true);
            } else {
              console.warn("Authorization failure: User role does not match.");
              setIsAuthorized(false);
            }
          } else if (loggedInUser.customer_token) {
            setIsLogged(true);
            console.log("Customer ID:", loggedInUser.customer_id); 
            setIsAuthorized(true);
          } else {
            setIsAuthorized(false);
          }
        }
      } catch (error) {
        console.error("Error during auth check:", error);
      } finally {
        setIsChecked(true);
      }
    };

    checkAuthorization();
  }, [roles]);

  // Wait for the auth check to complete before rendering anything
  if (!isChecked) {
    return <div>Loading...</div>;
  }

  // Check if user is logged in
  if (!isLogged) {
    console.log("Redirecting to login: User is not logged in.");
    return <Navigate to="/login" />;
  }

  // Check if user is authorized
  if (!isAuthorized) {
    console.log("Redirecting to unauthorized: User is not authorized.");
    return <Navigate to="/unauthorized" />;
  }

  // If logged in and authorized, render the children components
  return children;
};

export default PrivateAuthRoute;
