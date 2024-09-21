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

// Update order status of an existing order 
router.put('/api/order/:id/status', orderController.updateOrderStatus);

// Delete an order by ID
router.delete('/api/order/:id', orderController.deleteOrderById); 

module.exports = router;
