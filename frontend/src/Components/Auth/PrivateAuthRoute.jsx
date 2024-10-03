import React, { useState, useEffect } from "react";
import { Navigate } from "react-router";
import getAuth from "../util/auth"; // Function to get authenticated user from localStorage

const PrivateAuthRoute = ({ roles, children }) => {
  const [isChecked, setIsChecked] = useState(false); // Indicates if auth check is done
  const [isLogged, setIsLogged] = useState(false); // Tracks if user is logged in
  const [isAuthorized, setIsAuthorized] = useState(false); // Tracks if user has access to the route

  useEffect(() => {
    const checkAuthorization = async () => {
      try {
        const loggedInUser = await getAuth(); // Await the getAuth function to ensure it's resolved
        console.log("Logged in user:", loggedInUser);
        
        if (loggedInUser && loggedInUser.employee_token) {
          // User is logged in
          setIsLogged(true);

          // Check if the user's role matches the required roles for the route
          if (roles && roles.includes(loggedInUser.employee_role)) {
            setIsAuthorized(true);
          }
        }
      } catch (error) {
        console.error("Error during auth check:", error);
      } finally {
        setIsChecked(true); // Mark the check as done
      }
    };

    checkAuthorization();
  }, [roles]);

  if (!isChecked) {
    // Optionally, you can show a loading spinner or placeholder until the auth check is done
    return <div>Loading...</div>;
  }

  if (!isLogged) {
    // Redirect to login if not logged in
    return <Navigate to="/login" />;
  }

  if (!isAuthorized) {
    // Redirect to unauthorized page if the user doesn't have access
    return <Navigate to="/unauthorized" />;
  }

  // If everything is fine, render the children (the protected component)
  return children;
};

export default PrivateAuthRoute;
