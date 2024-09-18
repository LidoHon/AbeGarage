const dbConnection = require("../config/db.config");
const bcrypt = require("bcrypt");
const { StatusCodes } = require("status-codes");

//check if order already exists
async function checkOrders(orderId) {
  const query = "select * from orders where order_id === ?";
  const rows = await dbConnection.query(query, [orderId]);
  if (rows.length > 0) {
    return true;
  } else {
    return false;
  }
}

//creating new order 🤩

async function createNewOrder(order) {
  try {
    //creating a query to add orders
    //the capitalization of the "Orderder_date"

    //insert into the orders table
    const query1 =
      "insert into orders (employee_id,customer_id,vehicle_id,active_order,order_hash) values(?,?,?,?,?)";
    const [orderResult] = await dbConnection.query(query1, [
      order.employee_id,
      order.customer_id,
      order.vehicle_id,
      1,
      order.order_hash,
    ]);

    const orderId = orderResult.insertId;

    //insert into orders_info table
    const query2 =
      "insert into orders_info (order_id,order_total_price,estimated_completion_date,completion_date,additional_request,notes_for_internal_use, notes_for_customer,additional_requests_completed) values (?,?,?,?,?,?,?,?)";

    const [orderInfo] = await dbConnection.query(query2, [
      orderId,
      order.order_total_price,
      order.estimated_completion_date,
      order.completion_date || null,
      order.additional_request,
      order.notes_for_internal_use,
      order.notes_for_customer,
      0,
    ]);

    //inserting into orders service

    const query3 =
      "insert into order_service (order_id,service_id,service_completed) values (?,?,?)";
    for (let service of order.order_services) {
      await dbConnection.query(query3, [orderId, service.service_id, 0]);
    }

    //Inserting into orderstatus
    const query4 =
      "insert into order_status (order_id, order_status) values (?,?)";

    const [order_status] = await dbConnection.query(query4, [orderId, 1]);
    return { message: "Order Created Successfully", success: true, orderId };
  } catch (error) {
    throw error;
  }
}

//getting all the orderds
async function getAllOrders() {
  try {
    // Query to get all orders along with their services
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
JOIN order_info oi ON o.order_id = oi.order_id
LEFT JOIN order_services os ON o.order_id = os.order_id
GROUP BY o.order_id;

    `;

    const [orders] = await dbConnection.query(ordersQuery);

    return orders;
  } catch (error) {
    throw error;
  }
}

//getting single order
async function getOrderById(orderId) {
  try {
    // Query to get the order details without the services
    const orderQuery = `
      SELECT o.order_id, o.employee_id, o.customer_id, o.vehicle_id, 
             o.order_description, o.order_date, 
             o.estimated_completion_date, o.completion_date, o.order_completed
      FROM orders o
      WHERE o.order_id = ?;
    `;

    const [orderRows] = await dbConnection.query(orderQuery, [orderId]);

    // If no order found, return null
    if (orderRows.length === 0) {
      return null;
    }

    const order = orderRows[0];

    // Query to get the order services separately
    const servicesQuery = `
      SELECT os.order_service_id, os.order_id, os.service_id
      FROM order_services os
      WHERE os.order_id = ?;
    `;

    const [servicesRows] = await db.query(servicesQuery, [orderId]);

    // Add the services to the order object
    order.order_services = servicesRows;

    return order;
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    throw error;
  }
}

//updating an order
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

  await db.query(updateOrderQuery, [
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

async function updateOrderServices (orderId, orderServices) {
  // First, remove existing services for the order
  const deleteServicesQuery = `
    DELETE FROM order_services
    WHERE order_id = ?;
  `;
  await db.query(deleteServicesQuery, [orderId]);

  // Insert new services
  const insertServiceQuery = `
    INSERT INTO order_services (order_id, service_id)
    VALUES (?, ?);
  `;

  for (const service of orderServices) {
    await db.query(insertServiceQuery, [orderId, service.service_id]);
  }

};

//delete an order

module.exports = { createNewOrder, getAllOrders, getOrderById,updateOrder,updateOrderServices };
