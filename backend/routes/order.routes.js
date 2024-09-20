const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/order.controller");

//This created a new order
router.post("/api/order", ordersController.createOrder);

router.get("/api/orders", ordersController.getAllOrders);

router.get("/api/order/:id", ordersController.getOrderById);

router.put('/api/order', ordersController.updateOrder)
router.put("/api/order", ordersController.updateOrder);

router.delete("/order/:id", ordersController.deleteOrder);



const orderService = require('../services/order.service');

// Route to get requested services by order ID
router.get('/orders/:id/services', async (req, res) => {
  const orderId = req.params.id;

  try {
    const services = await orderService.getRequestedServicesForOrder(orderId);
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error("Error fetching services for order:", error);
    return res.status(500).json({ success: false, message: 'Error fetching services' });
  }
});

module.exports = router;