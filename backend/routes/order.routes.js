const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/order.controller");

//This created a new order
router.post("/api/order", ordersController.createOrder);

router.get("/api/orders", ordersController.getAllOrders);

router.get("/api/order/:id", ordersController.getOrderById);

router.put('/api/order', ordersController.updateOrder)




module.exports = router;
