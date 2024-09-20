// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the customer controller
const customerController = require("../controllers/customer.controller");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle the add customer request on post
router.post(
    "/api/customer",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    customerController.createCustomer
);

// Create a route to handle the get all customers request on get
router.get(
    "/api/customers",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    customerController.getAllCustomers
);

// Create a route to handle updating a customer by ID on put
router.put(
    "/api/customers/:id",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    customerController.updateCustomer
);

// Create a route to handle deleting a customer by ID on delete
router.delete(
    "/api/customers/:id",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    customerController.deleteCustomer
);

// Create a route to handle getting customer profile by ID (includes basic info)
router.get(
    "/api/customers/:customerId", 
    // [authMiddleware.verifyToken], 
    customerController.getCustomerProfile
);

// Create a route to handle getting vehicles for a customer by ID
router.get(
    "/api/customers/:customerId/vehicles",
    // [authMiddleware.verifyToken], 
    customerController.getCustomerVehicles
);

// Create a route to handle getting orders for a customer by ID
router.get(
    "/api/customers/:customerId/orders",
    // [authMiddleware.verifyToken], 
    customerController.getCustomerOrders
);

// Export the router
module.exports = router;
