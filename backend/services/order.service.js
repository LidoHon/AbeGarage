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

module.exports = { createNewOrder, getAllOrders };
