// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the order controller
const orderController = require("../controllers/order.controller");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");

// Create a route to handle adding a new order
router.post(
    "/api/order",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    orderController.createOrder
);

// Create a route to handle getting all orders
router.get(
    "/api/orders",
    // [authMiddleware.verifyToken],
    orderController.getAllOrders
);

// Create a route to handle updating an order by ID
router.put(
    "/api/orders/:id",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    orderController.updateOrder
);

// Create a route to handle deleting an order by ID
router.delete(
    "/api/orders/:id",
    // [authMiddleware.verifyToken, authMiddleware.isAdmin],
    orderController.deleteOrder
);

// Get a single order by ID
router.get(
    "/api/orders/:orderId",
    // [authMiddleware.verifyToken], 
    orderController.getOrderById
);

// Export the router
module.exports = router;
