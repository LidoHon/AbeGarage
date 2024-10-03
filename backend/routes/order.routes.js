const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

// Create new order
router.post('/api/order', orderController.createOrder); 

// Get all orders
router.get('/api/orders', orderController.getAllOrders);

// Get single order by ID
router.get('/api/order/:id', orderController.getOrderById);

// Update an existing order
router.put('/api/order/:id', orderController.updateOrder);

// // Update order status of an existing order 
// router.put('/api/order/:id/status', orderController.updateOrderStatus);

// Delete an order by ID
router.delete('/api/order/:id', orderController.deleteOrderById); 

// Route to get the order ID based on the task ID (order_service_id)
router.get("/api/order/task/:orderServiceId/order-id", orderController.getOrderIdFromTask);

// Route to get all services for a specific order
router.get("/api/order/:orderId/services", orderController.getAllServicesForOrder);

// Route to update the overall order status
router.put("/api/order/:orderId/status", orderController.updateOrderStatus);
module.exports = router;
