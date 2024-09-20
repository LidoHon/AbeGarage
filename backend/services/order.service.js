const dbConnection = require("../config/db.config");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("http-status-codes");

// Check if order already exists
async function checkOrders(orderId) {
  const query = "SELECT * FROM orders WHERE order_id = ?";
  const rows = await dbConnection.query(query, [orderId]);
  return rows.length > 0;
}

// Creating a new order
async function createNewOrder(order) {
  try {
    const query1 = "INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash) VALUES (?, ?, ?, ?, ?)";
    const [orderResult] = await dbConnection.query(query1, [order.employee_id, order.customer_id, order.vehicle_id, 1, order.order_hash]);

    const orderId = orderResult.insertId;

    const query2 = "INSERT INTO orders_info (order_id, order_total_price, estimated_completion_date, completion_date, additional_request, notes_for_internal_use, notes_for_customer, additional_requests_completed) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const [orderInfo] = await dbConnection.query(query2, [orderId, order.order_total_price, order.estimated_completion_date, order.completion_date || null, order.additional_request, order.notes_for_internal_use, order.notes_for_customer, 0]);

    const query3 = "INSERT INTO order_service (order_id, service_id, service_completed) VALUES (?, ?, ?)";
    for (let service of order.order_services) {
      await dbConnection.query(query3, [orderId, service.service_id, 0]);
    }

    const query4 = "INSERT INTO order_status (order_id, order_status) VALUES (?, ?)";
    const [order_status] = await dbConnection.query(query4, [orderId, 1]);

    return { message: "Order Created Successfully", success: true, orderId };
  } catch (error) {
    throw error;
  }
}

// Get all orders
async function getAllOrders() {
  try {
    const ordersQuery = `
     SELECT 
        o.order_id, 
        o.employee_id, 
        o.customer_id, 
        o.vehicle_id, 
        o.order_date, 
        oi.estimated_completion_date, 
        oi.completion_date, 
        oi.additional_request, 
        oi.additional_requests_completed, 
        os.service_completed,
        GROUP_CONCAT(
          CONCAT(
            '{"order_service_id": ', os.order_service_id, 
            ', "service_id": ', os.service_id, 
            ', "service_completed": ', os.service_completed, '}'
          )
        ) AS order_services
      FROM orders o
      JOIN orders_info oi ON o.order_id = oi.order_id
      LEFT JOIN order_service os ON o.order_id = os.order_id
      GROUP BY o.order_id;
    `;

    const [orders] = await dbConnection.query(ordersQuery);

    return orders;
  } catch (error) {
    throw error;
  }
}

// Get single order by ID
async function getOrderById(orderId) {
  try {
    const orderQuery = `
      SELECT o.order_id, o.employee_id, o.customer_id, o.vehicle_id, 
             o.order_description, o.order_date, 
             o.estimated_completion_date, o.completion_date, o.order_completed
      FROM orders o
      WHERE o.order_id = ?;
    `;

    const [orderRows] = await dbConnection.query(orderQuery, [orderId]);

    if (orderRows.length === 0) {
      return null;
    }

    const order = orderRows[0];

    const servicesQuery = `
      SELECT os.order_service_id, os.order_id, os.service_id
      FROM order_service os
      WHERE os.order_id = ?;
    `;

    const [servicesRows] = await dbConnection.query(servicesQuery, [orderId]);

    order.order_services = servicesRows;

    return order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
}

// Update an order
async function updateOrder(orderId, orderData) {
  const {
    customer_id,
    employee_id,
    vehicle_id,
    order_description,
    order_date,
    estimated_completion_date,
    completion_date,
    order_completed,
  } = orderData;

  const updateOrderQuery = `
    UPDATE orders
    SET 
      customer_id = ?, 
      employee_id = ?, 
      vehicle_id = ?, 
      order_description = ?, 
      order_date = ?, 
      estimated_completion_date = ?, 
      completion_date = ?, 
      order_completed = ?
    WHERE order_id = ?;
  `;

  await dbConnection.query(updateOrderQuery, [
    customer_id,
    employee_id,
    vehicle_id,
    order_description,
    order_date,
    estimated_completion_date,
    completion_date,
    order_completed,
    orderId,
  ]);
}

async function updateOrderServices(orderId, orderServices) {
  const deleteServicesQuery = "DELETE FROM order_service WHERE order_id = ?";
  await dbConnection.query(deleteServicesQuery, [orderId]);

  const insertServiceQuery = "INSERT INTO order_service (order_id, service_id) VALUES (?, ?)";

  for (const service of orderServices) {
    await dbConnection.query(insertServiceQuery, [orderId, service.service_id]);
  }
}

// module.exports = { createNewOrder, getAllOrders, getOrderById, updateOrder, updateOrderServices };

// Order Service file (order.service.js)

const getRequestedServicesForOrder = async (orderId) => {
  try {
    const query = `
      SELECT os.order_service_id, os.service_id, cs.service_name, cs.service_description, os.service_completed
      FROM order_service os
      JOIN common_services cs ON os.service_id = cs.service_id
      WHERE os.order_id = ?;
    `;

    const [services] = await dbConnection.query(query, [orderId]);

    return services;
  } catch (error) {
    console.error("Error fetching requested services:", error);
    throw error;
  }
};

// Export the function in addition to the others
module.exports = {
  createNewOrder,
  getAllOrders,
  getOrderById,
  updateOrder,
  updateOrderServices,
  getRequestedServicesForOrder, // Add this line
};