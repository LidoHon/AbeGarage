const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/order.controller");
const middleware = require("../middlewares/auth.middleware")

//This created a new order
router.post("/api/order",middleware.verifyToken ,ordersController.createOrder);

router.get("/api/orders", middleware.verifyToken,ordersController.getAllOrders);

router.get("/api/order/:id", middleware.verifyToken,ordersController.getOrderById);

router.put("/api/order", middleware.verifyToken,ordersController.updateOrder);

router.delete("/order/:id",middleware.verifyToken, ordersController.deleteOrder);

module.exports = router;
