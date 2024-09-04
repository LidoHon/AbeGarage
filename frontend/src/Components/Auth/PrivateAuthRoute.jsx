// Import React, the useState and useEffect hooks
import React, { useState, useEffect } from "react";
// Import the Route and Navigate components
import { Navigate } from "react-router";
// Import the Util function we created to handle the reading from the local storage
import getAuth from "../util/auth";

const PrivateAuthRoute = ({ roles, children }) => {
  const [isChecked, setIsChecked] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Retrieve the logged in user from local storage
    const loggedInEmployee = getAuth();
    console.log(loggedInEmployee);
    loggedInEmployee.then((response) => {
      // console.log(response);
      if (response.employee_token) {
        // If in here, that means the user is logged in
        // console.log(response);
        // console.log("Set logged in to true");
        setIsLogged(true);
        if (
          roles &&
          roles.length > 0 &&
          roles.includes(response.employee_role)
        ) {
          // console.log(response.employee_role)
          // If in here, that means the user is logged and has  authorization to access the route
          // console.log("Set authorized to true");
          setIsAuthorized(true);
        }
      }
      setIsChecked(true);
    });
  }, [roles]);
  if (isChecked) {
    if (!isLogged) {
      return <Navigate to="/login" />;
    }
    if (!isAuthorized) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
};

export default PrivateAuthRoute;

// - Pages on our app (From the Wire-Frames)
// - Root level public pages (No authentication required)
//   - Home page (/)
//   - About us page (/about)
//   - Services page (/services)
//   - Contact us page (/contact)
//   - Admin page
//     - Show only if logged in, link to the dashboard (/dashboard)
//   - Login (/login)
//   - Order details (/order/{orderHash})
//     - Not to be included on the menu

// - Admin (Login required)
//   - Admin dashboard (/admin) (Only for admins)
//   - Employees (/admin/employees) (Only for admins)
//   - Add employee (/admin/add-employee) (Only for admins)
//   - Edit employee (/admin/employee/edit/:id) (Only for admins)
//   - Customers (/admin/customers) (Managers and Admins)
//   - Add customer (/admin/add-customer) (Managers and Admins)
//   - Edit customer (/admin/customer/edit/:id) (Managers and Admins)
//   - Customer details (/admin/customer/{customerId}) (Managers and Admins)
//   - Add vehicle (/admin/customer/{customerId}) - Conditionally displayed on the customer details page (Managers and Admins)
//   - Orders (/admin/orders) (All Authenticated users)
//   - Add order (/admin/order) (Managers and Admins)
//   - Edit order (/admin/order/{orderHash}/edit) (Managers and Admins)
//   - Services (/admin/services) (Only for admins)
//   - Add service (/admin/add-service) (Only for admins)
