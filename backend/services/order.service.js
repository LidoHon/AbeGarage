const conn = require("../config/conn.config");

// Create a new order
async function createOrder({ employee_id, customer_id, vehicle_id, active_order, order_hash, order_total_price, estimated_completion_date, additional_request }) {
    const orderQuery = `
        INSERT INTO orders (employee_id, customer_id, vehicle_id, active_order, order_hash)
        VALUES (?, ?, ?, ?, ?)`;
    const orderInfoQuery = `
        INSERT INTO order_info (order_id, order_total_price, estimated_completion_date, additional_request)
        VALUES (?, ?, ?, ?)`;

    const connection = await conn.getconnection();  

    try {
        await connection.beginTransaction();  

        const [orderResult] = await connection.query(orderQuery, [employee_id, customer_id, vehicle_id, active_order, order_hash]);

        if (orderResult.affectedRows === 1) {
            const order_id = orderResult.insertId;

            // Insert into order_info
            await connection.query(orderInfoQuery, [order_id, order_total_price, estimated_completion_date, additional_request]);

            // Commit the transaction
            await connection.commit();

            return {
                order_id,
                employee_id,
                customer_id,
                vehicle_id,
                active_order,
                order_hash,
                order_total_price,
                estimated_completion_date,
                additional_request
            };
        } else {
            throw new Error('Failed to create order');
        }
    } catch (err) {
        console.log("Error creating order:", err);
        await connection.rollback();  
        throw err;
    } finally {
        connection.release();  
    }
}

// Get all orders
async function getAllOrders() {
    const query = `
        SELECT o.*, oi.order_total_price, oi.estimated_completion_date
        FROM orders o
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        ORDER BY o.order_id`;

    try {
        const [rows] = await conn.query(query);
        return rows;
    } catch (err) {
        console.log("Error fetching orders:", err);
        throw err;
    }
}

// Get order by ID
async function getOrderById(orderId) {
    const query = `
        SELECT o.*, oi.order_total_price, oi.estimated_completion_date, oi.completion_date, oi.additional_request, oi.notes_for_internal_use, oi.notes_for_customer
        FROM orders o
        LEFT JOIN order_info oi ON o.order_id = oi.order_id
        WHERE o.order_id = ?`;

    try {
        const [rows] = await conn.query(query, [orderId]);
        return rows[0];  // Return the first matching order
    } catch (err) {
        console.log("Error fetching order:", err);
        throw err;
    }
}

// Update an order
async function updateOrder(orderId, { order_total_price, estimated_completion_date, additional_request, notes_for_internal_use, notes_for_customer }) {
    const query = `
        UPDATE order_info 
        SET order_total_price = ?, estimated_completion_date = ?, additional_request = ?, notes_for_internal_use = ?, notes_for_customer = ?
        WHERE order_id = ?`;

    try {
        const [result] = await conn.query(query, [order_total_price, estimated_completion_date, additional_request, notes_for_internal_use, notes_for_customer, orderId]);

        if (result.affectedRows === 1) {
            return {
                order_id: orderId,
                order_total_price,
                estimated_completion_date,
                additional_request,
                notes_for_internal_use,
                notes_for_customer
            };
        } else {
            throw new Error('Failed to update order');
        }
    } catch (err) {
        console.log("Error updating order:", err);
        throw err;
    }
}

// Delete an order by ID
async function deleteOrder(orderId) {
    const query = 'DELETE FROM orders WHERE order_id = ?';
    try {
        const [result] = await conn.query(query, [orderId]);

        if (result.affectedRows === 0) {
            throw new Error('Order not found or failed to delete');
        }
        return true;
    } catch (err) {
        console.log("Error deleting order:", err);
        throw err;
    }
}

// Add services to an order
async function addOrderServices(orderId, services) {
    const query = `
        INSERT INTO order_services (order_id, service_id, service_completed)
        VALUES (?, ?, ?)`;

    const connection = await conn.getconnection();  

    try {
        await connection.beginTransaction();  

        for (const service of services) {
            const { service_id, service_completed } = service;
            await connection.query(query, [orderId, service_id, service_completed]);
        }

        await connection.commit();  
        return { message: "Services added to order" };
    } catch (err) {
        console.log("Error adding services to order:", err);
        await connection.rollback(); 
        throw err;
    } finally {
        connection.release();  
    }
}

module.exports = {
    createOrder,
    getAllOrders,
    updateOrder,
    deleteOrder,
    getOrderById,
    addOrderServices
};
