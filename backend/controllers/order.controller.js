const orderService = require("../services/order.service");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("status-codes");


//creating new orders
async function createOrder(req, res, next) {
  try {
    const {
      employee_id,
      customer_id,
      vehicle_id,
      order_description,
      estimated_completion_date,
      completion_date,
      order_completed,
      order_services,
    } = req.body;

    if (
      !employee_id ||
      !customer_id ||
      !vehicle_id ||
      !order_description ||
      !order_services
    ) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Bad Request",
        message: "Please provide all required fields",
      });
    }
    //generating hash
    const salt = await bcrypt.genSalt(10);
    const rawOrderHash = Math.random().toString(36).substring(2, 15);
    const order_hash = await bcrypt.hash(rawOrderHash, salt);

    const orderData = {
      employee_id,
      customer_id,
      vehicle_id,
      order_description,
      estimated_completion_date,
      completion_date,
      order_completed,
      order_hash,
      order_services,
    };
    const result = await orderService.createNewOrder(orderData);

    res.status(201).json({
      message: "Order created successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Internal Server Error",
      message: "An unexpected error occurred.",
    });
  }
}

// getting all the orders 
async function getAllOrders(req, res, next) {
  try {
    // Fetch all orders with their associated services
    const orders = await orderService.getAllOrders();

    // Send success response
    res.status(201).json({
      message: "Orders retrieved successfully",
      success: true,
      data: orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);

    // Send error response
    res.status(500).json({
      message: "An error occurred while retrieving orders",
      error: error.message,
    });
  }
}

module.exports = { createOrder , getAllOrders};
