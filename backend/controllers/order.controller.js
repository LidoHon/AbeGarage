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
    // Log the entire request body for debugging
    console.log("Received order data in the request body:", req.body);

    // Validate the request payload
    if (!orderData || !orderInfoData || !orderServiceData || orderServiceData.length === 0) {
      return res.status(400).json({
        message: 'Missing required data: orderData, orderInfoData, or orderServiceData',
      });
    }

    // Log incoming request details for debugging
    console.log("Received order data:", orderData);
    console.log("Received order info data:", orderInfoData);
    console.log("Received order service data:", orderServiceData);

    // Ensure all services have an employee assigned
    const unassignedServices = orderServiceData.filter(service => !service.employee_id);
    if (unassignedServices.length > 0) {
      return res.status(400).json({
        message: 'All services must have an employee assigned',
      });
    }

    // Call the service function to handle the order creation
    const result = await orderService.createOrder(orderData, orderInfoData, orderServiceData);

    console.log("Order creation result:", result);

    // Respond with success
    res.status(201).json(result);

  } catch (error) {
    
    console.error('Error creating order:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ message: 'Error creating order', error: error.message });
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

// get the order i from the task
const getOrderIdFromTask = async (req, res) => {
  try {
    const { orderServiceId } = req.params;
    const orderId = await orderService.getOrderIdFromTask(orderServiceId);

    if (!orderId) {
      return res.status(404).json({ message: "Order ID not found" });
    }

    res.status(200).json({ order_id: orderId });
  } catch (error) {
    console.error("Error fetching order ID:", error);
    res.status(500).json({ message: "Error fetching order ID" });
  }
};

// controller for get all the services for a single order
const getAllServicesForOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const services = await orderService.getAllServicesForOrder(orderId);

    if (!services || services.length === 0) {
      return res.status(404).json({ message: "No services found for the order" });
    }

    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Error fetching services for the order" });
  }
};

// the entire order status not only the services
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (![1, 2, 3].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const result = await orderService.updateOrderStatus(orderId, status);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Order not found or status not updated" });
    }

    res.status(200).json({ message: "Order status updated successfully" });
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: "Error updating order status" });
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



// Export all at the end
module.exports = {
  getAllCustomersForOrder,
  createOrder,
  getAllOrders,
  getOrderById,
  getOrderIdFromTask,
  updateOrder,
  getAllServicesForOrder,
  updateOrderStatus,
  deleteOrderById,
};
