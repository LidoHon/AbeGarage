const db = require('../config/db.config');

// Service to handle creating the entire order (order + order details + services)
async function createOrder(orderData, orderInfoData, orderServiceData) {
    try {
        // Step 1: Create the main order entry in the 'orders' table
        console.log("Creating order with data:", orderData);
        const query1 = `
            INSERT INTO orders (employee_id, customer_id, vehicle_id, order_date, active_order, order_hash)
            VALUES (?, ?, ?, NOW(), ?, ?)
        `;
        const result1 = await db.query(query1, [
            orderData.employee_id,  
            orderData.customer_id,  
            orderData.vehicle_id,   
            orderData.active_order, 
            orderData.order_hash    
        ]);

        // Log the entire result1 to check its structure
        console.log("Result from DB query (order creation):", result1);

        // Access insertId from the correct index
        const order_id = result1.insertId || result1[0]?.insertId;
        
        if (!order_id) {
            throw new Error('Failed to retrieve order ID after inserting order');
        }
        
        console.log("Order created with ID:", order_id);

        // Step 2: Add the order details in 'order_info'
        console.log("Adding order details:", orderInfoData);
        const query2 = `
            INSERT INTO order_info (order_id, order_total_price, estimated_completion_date, additional_request, additional_requests_completed)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(query2, [
            order_id,
            orderInfoData.order_total_price,                
            orderInfoData.estimated_completion_date,        
            orderInfoData.additional_request,               
            orderInfoData.additional_requests_completed     
        ]);

        // Step 3: Add services related to the order
        console.log("Adding services for order:", orderServiceData);
        if (Array.isArray(orderServiceData) && orderServiceData.length > 0) {
            for (const service of orderServiceData) {
                if (service.service_id) {
                    const query3 = `
                        INSERT INTO order_services (order_id, service_id, service_completed)
                        VALUES (?, ?, ?)
                    `;
                    await db.query(query3, [order_id, service.service_id, service.service_completed]);
                } else {
                    console.log("Skipping service with missing service_id");
                }
            }
        } else {
            console.log("No services selected for this order.");
        }

        // Step 4: Add default order status
        console.log("Adding default order status");
        const query4 = `
            INSERT INTO order_status (order_id, order_status)
            VALUES (?, ?)
        `;
        await db.query(query4, [order_id, 1]);  

        console.log("Order, details, services, and status created successfully");
        return { 
            message: 'Order created successfully', 
            order_id: order_id 
        };

    } catch (error) {
        console.error('Error creating full order:', error);
        throw new Error('Failed to create full order.');
    }
}


// Service to fetch all orders
const getAllOrders = async () => {
    try {
        const query = `
            SELECT o.order_id, o.order_date, 
                    ci.customer_first_name, ci.customer_last_name, 
                    c.customer_email, ci.customer_phone, 
                    v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_tag,
                    e.employee_first_name, e.employee_last_name,
                    os.order_status
            FROM orders o
            JOIN customer_info ci ON o.customer_id = ci.customer_id
            JOIN customer c ON ci.customer_id = c.customer_id
            JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
            JOIN employee_info e ON o.employee_id = e.employee_id
            JOIN order_status os ON o.order_id = os.order_id
        `;
        const rows = await db.query(query);
        console.log("Orders fetched from DB:", rows);
        return rows; 
    } catch (error) {
        console.error("Error fetching orders from DB:", error);
        throw error;
    }
};


// Get single order by ID
async function getOrderById(orderId) {
    try {
        const query = `
        SELECT o.order_id, o.order_date, ci.customer_first_name, ci.customer_last_name, 
                c.customer_email, ci.customer_phone, v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_tag,
                oi.order_total_price, oi.additional_request, e.employee_first_name, e.employee_last_name
        FROM orders o
        JOIN customer_info ci ON o.customer_id = ci.customer_id
        JOIN customer c ON o.customer_id = c.customer_id
        JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
        JOIN order_info oi ON o.order_id = oi.order_id
        JOIN employee_info e ON o.employee_id = e.employee_id
        WHERE o.order_id = ?
        `;
        
        // Fetch the order by order ID
        const order = await db.query(query, [orderId]); 
        
        // Log the result to debug the output from the database
        console.log("Order from DB:", order);

        if (!order || order.length === 0) {
            throw new Error(`No order found with ID: ${orderId}`);
        }

        return order[0]; 
    } catch (error) {
        console.error("Error fetching order by ID from DB:", error);
        throw error;
    }
}

// Update an order
async function updateOrder(id, updateData) {
    const { order_description, estimated_completion_date, completion_date, order_completed } = updateData;

    console.log("Updating order with ID:", id, updateData);  

    const query = `
        UPDATE orders
        SET order_description = ?, estimated_completion_date = ?, completion_date = ?, order_completed = ?
        WHERE order_id = ?
    `;

    try {
        const result = await db.query(query, [
            order_description,
            estimated_completion_date,
            completion_date,
            order_completed,
            id
        ]);

        console.log("Order updated in DB with result:", result); 
        return { message: 'Order updated successfully' };
    } catch (error) {
        console.error('Error updating order in DB:', error);
        throw new Error('Failed to update order');
    }
}

// Update services for an order
async function updateOrderServices(order_id, services) {
    console.log("Updating services for order ID:", order_id, "with services:", services);  

    // First, remove all existing services for the order
    await db.query('DELETE FROM order_services WHERE order_id = ?', [order_id]);

    // Then, insert the new services
    const query = `
        INSERT INTO order_services (order_id, service_id)
        VALUES (?, ?)
    `;

    try {
        for (const service_id of services) {
            console.log("Inserting updated service:", service_id);  
            await db.query(query, [order_id, service_id]);
        }

        console.log("Order services updated successfully for order ID:", order_id);  
        return { message: 'Order services updated successfully' };
    } catch (error) {
        console.error('Error updating order services in DB:', error);
        throw new Error('Failed to update order services');
    }
}

// Delete an order by its ID
const deleteOrderById = async (orderId) => {
    try {
        // Delete from `order_services` first
        await db.query('DELETE FROM order_services WHERE order_id = ?', [orderId]);

        // Then delete from `order_info`
        await db.query('DELETE FROM order_info WHERE order_id = ?', [orderId]);

        // Then delete from `order_status`
        await db.query('DELETE FROM order_status WHERE order_id = ?', [orderId]);

        // Finally, delete from `orders`
        await db.query('DELETE FROM orders WHERE order_id = ?', [orderId]);

        console.log(`Order ${orderId} and associated records deleted from DB`);
    } catch (error) {
        console.error(`Error deleting order with ID ${orderId}:`, error);
        throw error;
    }
};

// Export all functions at the end
module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    updateOrderServices,
    deleteOrderById,
};
