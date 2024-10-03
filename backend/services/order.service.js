const db = require('../config/db.config');

// Service to handle creating the entire order (order + order details + services)
const createOrder = async (orderData, orderInfoData, orderServiceData) => {
    try {
        let createdOrder = {};

      // Insert the main order details into the `orders` table
        const orderInsertQuery = `
        INSERT INTO orders (customer_id, vehicle_id, employee_id, active_order, order_hash)
        VALUES (?, ?, ?, ?, ?)
        `;
        const orderResult = await db.query(orderInsertQuery, [
        orderData.customer_id,
        orderData.vehicle_id,
        orderData.employee_id,
        orderData.active_order,
        orderData.order_hash,
        ]);
    
        // Get the generated order_id from the orders insert
        const orderId = orderResult.insertId;
    
        // Insert the order information into the `order_info` table
        const orderInfoInsertQuery = `
            INSERT INTO order_info (order_id, order_total_price, additional_request, estimated_completion_date, additional_requests_completed)
            VALUES (?, ?, ?, ?, ?)
        `;
        await db.query(orderInfoInsertQuery, [
            orderId,
            orderInfoData.order_total_price,
            orderInfoData.additional_request,
            orderInfoData.estimated_completion_date,
            orderInfoData.additional_requests_completed,
        ]);
    
      // Insert the services associated with the order into the `order_services` table
        for (const service of orderServiceData) {
            const serviceInsertQuery = `
            INSERT INTO order_services (order_id, service_id, service_completed)
            VALUES (?, ?, ?)
            `;
            const serviceResult = await db.query(serviceInsertQuery, [
            orderId,
            service.service_id,
            service.service_completed,
            ]);
    
            const orderServiceId = serviceResult.insertId;
    
            // Assign employees to each service in the `order_service_employee` table
            const serviceEmployeeQuery = `
            INSERT INTO order_service_employee (order_service_id, employee_id)
            VALUES (?, ?)
            `;
            await db.query(serviceEmployeeQuery, [orderServiceId, service.employee_id]);
    
            // Insert the initial service status into the `order_status` table
            const orderStatusServiceQuery = `
            INSERT INTO order_status (order_id, order_service_id, order_status)
            VALUES (?, ?, ?)
            `;
            await db.query(orderStatusServiceQuery, [orderId, orderServiceId, 1]); 
        }
    
      // Insert the overall order status into the `order_status` table
        const orderStatusQuery = `
            INSERT INTO order_status (order_id, order_status)
            VALUES (?, ?)
        `;
        await db.query(orderStatusQuery, [orderId, 1]); 
    
        createdOrder = { order_id: orderId };
    
        
        return { message: 'Order created successfully', createdOrder };
    
        } catch (error) {
        console.error("Error creating order:", error);
        throw error;
        }
    };
    
        

// get all orders 
const getAllOrders = async () => {
    try {
        const query = `
            SELECT 
            o.order_id, 
            o.order_date,
            ci.customer_first_name, 
            ci.customer_last_name,
            c.customer_email, 
            ci.customer_phone,
            v.vehicle_make, 
            v.vehicle_model, 
            v.vehicle_year, 
            v.vehicle_tag,
            v.vehicle_mileage,
            e.employee_first_name, 
            e.employee_last_name,

            -- Determine overall order status:
            CASE
                -- If all services are completed, set overall status to "Completed" (status = 3)
                WHEN SUM(os_service.order_status = 3) = COUNT(os_service.order_service_id) THEN 3
                -- If any service is either "In Progress" (status = 2) or "Completed" (status = 3), set overall status to "In Progress" (status = 2)
                WHEN SUM(os_service.order_status = 2) > 0 OR SUM(os_service.order_status = 3) > 0 THEN 2
                -- Otherwise, if all services are "Received" (status = 1), set overall status to "Received" (status = 1)
                ELSE 1
            END AS order_status,

            oi.order_total_price,  
            oi.estimated_completion_date,  
            GROUP_CONCAT(DISTINCT cs.service_name SEPARATOR ', ') AS service_name,
            GROUP_CONCAT(DISTINCT cs.service_description SEPARATOR '; ') AS service_descriptions,
            oi.additional_request
            FROM orders o
            JOIN customer_info ci ON o.customer_id = ci.customer_id
            JOIN customer c ON ci.customer_id = c.customer_id
            JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
            JOIN order_services os ON o.order_id = os.order_id  -- Use the order_services table to track services
            LEFT JOIN common_services cs ON os.service_id = cs.service_id
            JOIN employee_info e ON o.employee_id = e.employee_id 
            JOIN order_info oi ON o.order_id = oi.order_id

            -- Fetch service-level statuses
            LEFT JOIN order_status os_service ON os.order_service_id = os_service.order_service_id

            -- Group by necessary columns
            GROUP BY 
            o.order_id, 
            o.order_date,
            ci.customer_first_name, 
            ci.customer_last_name,
            c.customer_email, 
            ci.customer_phone,
            v.vehicle_make, 
            v.vehicle_model, 
            v.vehicle_year, 
            v.vehicle_tag,
            v.vehicle_mileage,
            e.employee_first_name, 
            e.employee_last_name,
            oi.order_total_price,
            oi.estimated_completion_date, 
            oi.additional_request;
        `;

        const rows = await db.query(query);
        console.log("Orders fetched from DB:", rows);
        return rows;
    } catch (error) {
        console.error("Error fetching orders from DB:", error);
        throw error;
    }
};


    
// get all services ordered in one order
const getAllServicesForOrder = async (orderId) => {
    const query = `SELECT service_completed FROM order_services WHERE order_id = ?`;
    const rows = await db.query(query, [orderId]);
    return rows; 
};


// get order by Id 
const getOrderById = async (orderId) => {
    try {
        const query = `
            SELECT 
            o.order_id, 
            o.order_date, 
            ci.customer_first_name, 
            ci.customer_last_name, 
            c.customer_email, 
            ci.customer_phone, 
            v.vehicle_make, 
            v.vehicle_model, 
            v.vehicle_year, 
            v.vehicle_tag, 
            v.vehicle_mileage,
            e.employee_first_name, 
            e.employee_last_name,
            oi.order_total_price, 
            oi.estimated_completion_date, 
            oi.additional_request,  
            c.active_customer,
    
            -- Dynamically calculate the overall order status:
            CASE 
                WHEN SUM(os_service.order_status = 2) > 0 THEN 2 -- If any service is "In Progress"
                WHEN SUM(os_service.order_status = 3) = COUNT(os_service.order_service_id) THEN 3 -- If all services are "Completed"
                ELSE 1  -- If all services are still "Received"
            END AS overall_order_status, -- Dynamically calculate the overall status
    
            GROUP_CONCAT(cs.service_name SEPARATOR ', ') AS service_name,
            GROUP_CONCAT(cs.service_description SEPARATOR '; ') AS service_descriptions,
            GROUP_CONCAT(os_service.order_status SEPARATOR ', ') AS service_statuses
            FROM orders o
            JOIN customer_info ci ON o.customer_id = ci.customer_id
            JOIN customer c ON ci.customer_id = c.customer_id
            JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
            JOIN employee_info e ON o.employee_id = e.employee_id
            JOIN order_info oi ON o.order_id = oi.order_id 
            
            -- Join for service-level statuses and service completion
            LEFT JOIN order_services os2 ON o.order_id = os2.order_id
            LEFT JOIN common_services cs ON os2.service_id = cs.service_id
            -- Fetch service-level statuses
            LEFT JOIN order_status os_service ON os2.order_service_id = os_service.order_service_id 
            
            -- Separate join for overall order status (where order_service_id is NULL)
            LEFT JOIN order_status os_overall ON os_overall.order_id = o.order_id AND os_overall.order_service_id IS NULL
    
            WHERE o.order_id = ?
            GROUP BY 
            o.order_id, 
            ci.customer_first_name, 
            ci.customer_last_name, 
            c.customer_email, 
            ci.customer_phone,
            v.vehicle_make, 
            v.vehicle_model, 
            v.vehicle_year, 
            v.vehicle_tag, 
            v.vehicle_mileage,
            e.employee_first_name, 
            e.employee_last_name, 
            oi.order_total_price, 
            oi.estimated_completion_date, 
            oi.additional_request, 
            c.active_customer
        `;
    
        const rows = await db.query(query, [orderId]);
    
        if (rows.length === 0) {
            throw new Error("Order not found");
        }
    
        return rows[0]; 
        } catch (error) {
        console.error("Error fetching order by ID:", error);
        throw error;
        }
    };


    
//get order id from task 
const getOrderIdFromTask = async (task_id) => {
    const query = `SELECT order_id FROM order_services WHERE order_service_id = ?`;
    const rows = await db.query(query, [task_id]);
    return rows.length > 0 ? rows[0].order_id : null;
}; 

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

const updateOrderStatus = async (orderId, status) => {
    const query = `UPDATE order_status SET order_status = ? WHERE order_id = ? AND order_service_id IS NULL`; 
    await db.query(query, [status, orderId]);
};

// Update services for an order
async function updateOrderServices(order_id, services) {
    console.log("Updating services for order ID:", order_id, "with services:", services);  
    await db.query('DELETE FROM order_services WHERE order_id = ?', [order_id]);
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
        await db.query('DELETE FROM order_services WHERE order_id = ?', [orderId]);
        await db.query('DELETE FROM order_info WHERE order_id = ?', [orderId]);
        await db.query('DELETE FROM order_status WHERE order_id = ?', [orderId]);
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
    getAllServicesForOrder,
    getOrderById,
    getOrderIdFromTask,
    updateOrder,
    updateOrderStatus,
    updateOrderServices,
    deleteOrderById,
};
