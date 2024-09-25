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
// Import the service routes
const serviceRoutes = require("./service.routes");
// Import the order routes 
const orderRoutes = require("./order.routes");  

// Add the install router 
router.use(installRouter);
// Add the employee routes 
router.use(employeeRouter);
// Add the customer routes 
router.use(customerRouter); 
// Add the login routes 
router.use(loginRoutes);
// Add the vehicle routes 
router.use(vehicleRoutes);
// Add the service routes
router.use(serviceRoutes);
// Add the order routes 
router.use(orderRoutes);  

// Export the router
module.exports = router;
