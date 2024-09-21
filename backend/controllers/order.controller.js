const orderService = require("../services/order.service");
const customerService = require('../services/customer.service'); 

// Example function to fetch customers within order context
const getAllCustomersForOrder = async (req, res) => {
    try {
        const searchQuery = req.query.search || '';
        console.log("Search Query:", searchQuery);
        const customers = await customerService.getAllCustomers(searchQuery);  
        console.log("Customers found:", customers.length);
        res.status(200).json({
            status: 'success',
            customers,
        });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch customers for order',
        });
    }
};

// Create a new order
const createOrder = async (req, res) => {
  try {
    const { orderData, orderInfoData, orderServiceData } = req.body;

    console.log("Received order, info, and service data:", { orderData, orderInfoData, orderServiceData });

    // Call the service function to handle everything
    const result = await orderService.createOrder(orderData, orderInfoData, orderServiceData);

    res.status(201).json(result);

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order' });
  }
};


// Controller to fetch all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    console.log("Orders to be sent to frontend:", orders);  
    
    res.status(200).json({
      status: "success",
      data: {
        orders, 
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      status: "error",
      message: 'Error fetching orders',
    });
  }
};

const getOrderById = async (req, res) => {
  try {
      const { id: orderId } = req.params;
      console.log("Received Order ID:", orderId);
      if (!orderId) {
          return res.status(400).json({ message: "Order ID is required" });
      }

      const order = await orderService.getOrderById(orderId);
      if (!order) {
          return res.status(404).json({ message: "Order not found" });
      }

      res.status(200).json({
          status: "success",
          data: order,
      });
  } catch (error) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ message: "Error fetching order details" });
  }
};

// Update an existing order
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      order_description,
      estimated_completion_date,
      completion_date,
      order_completed,
      order_services
    } = req.body;

    // Log the update data
    console.log("Updating order with id:", id, req.body);

    // Call service to update order
    const updatedOrder = await orderService.updateOrder(id, {
      order_description,
      estimated_completion_date,
      completion_date,
      order_completed,
    });

    console.log("Order updated successfully for id:", id);

    // Update the order services if necessary
    if (order_services && order_services.length > 0) {
      console.log("Updating services for order id:", id);
      await orderService.updateOrderServices(id, order_services);
    }

    res.status(200).json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order' });
  }
};

// Delete an order by ID
const deleteOrderById = async (req, res) => {
  try {
    const { id: orderId } = req.params;
    console.log("Received Order ID to delete:", orderId);

    if (!orderId) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    await orderService.deleteOrderById(orderId);

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Error deleting order" });
  }
};

// Controller to update the order status
const updateOrderStatus = async (req, res) => {
  try {
      const { id: orderId } = req.params;
      const { order_status } = req.body;

      // Validate if the status is provided and correct
      if (![1, 2, 3].includes(order_status)) {
          return res.status(400).json({ message: "Invalid order status. Must be 1 (Received), 2 (In Progress), or 3 (Completed)." });
      }

      // Call the service to update the order status
      const result = await orderService.updateOrderStatus(orderId, order_status);

      res.status(200).json({
          message: 'Order status updated successfully',
          data: result,
      });
  } catch (error) {
      console.error('Error updating order status:', error);
      res.status(500).json({
          message: 'Error updating order status',
      });
  }
};


// Export all at the end
module.exports = {
  getAllCustomersForOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderStatus,
  deleteOrderById,
};
