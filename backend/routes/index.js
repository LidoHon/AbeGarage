// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();

// Import the install router
const installRouter = require("./install.routes");
// Import the employee routes
const employeeRouter = require("./employee.routes");
// Import the customer routes
const customerRouter = require("./customer.routes");
// Import the login routes
const loginRoutes = require("./login.routes");
// Import the vehicle routes
const vehicleRoutes = require("./vehicle.routes");
// Import your service routes
const serviceRoutes = require("./service.routes");

// Add the install router to the main router
router.use(installRouter);
// Add the employee routes to the main router
router.use(employeeRouter);
// Add the customer routes to the main router
router.use(customerRouter); // Add the customer router
// Add the login routes to the main router
router.use(loginRoutes);
// Add the Vehicle routes to the main router
router.use(vehicleRoutes);
// Register the service routes
router.use(serviceRoutes);
// Export the router
module.exports = router;
