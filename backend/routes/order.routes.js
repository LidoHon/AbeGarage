const express = require("express");
const router = express.Router();
const ordersController = require("../controllers/order.controller");


//This created a new order
router.post("/api/order", ordersController.createOrder);




module.exports = router