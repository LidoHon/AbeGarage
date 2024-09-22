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

        // Log the result of the order creation
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
        const orderServiceIds = [];
        if (Array.isArray(orderServiceData) && orderServiceData.length > 0) {
            for (const service of orderServiceData) {
                if (service.service_id) {
                    const query3 = `
                        INSERT INTO order_services (order_id, service_id, service_completed)
                        VALUES (?, ?, ?)
                    `;
                    const result3 = await db.query(query3, [order_id, service.service_id, service.service_completed]);
                    const order_service_id = result3.insertId;
                    orderServiceIds.push({ order_service_id, employee_id: service.employee_id });
                } else {
                    console.log("Skipping service with missing service_id");
                }
            }
        } else {
            console.log("No services selected for this order.");
        }

        // Step 4: Add employee assignments to 'order_service_employee'
        if (orderServiceIds.length > 0) {
            console.log("Assigning employees to services");
            for (const assignment of orderServiceIds) {
                const query4 = `
                    INSERT INTO order_service_employee (order_service_id, employee_id)
                    VALUES (?, ?)
                `;
                await db.query(query4, [assignment.order_service_id, assignment.employee_id]);
            }
        } else {
            console.log("No employee assignments found.");
        }

        // Step 5: Add default order status
        console.log("Adding default order status");
        const query5 = `
            INSERT INTO order_status (order_id, order_status)
            VALUES (?, ?)
        `;
        await db.query(query5, [order_id, 1]);  

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

// get all orders 
const getAllOrders = async () => {
    try {
      const query = `
            SELECT o.order_id, o.order_date,
                   ci.customer_first_name, ci.customer_last_name,
                   c.customer_email, ci.customer_phone,
                   v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_tag,v.vehicle_mileage,
                   e.employee_first_name, e.employee_last_name,
                   os.order_status,
                   oi.order_total_price,  -- Add total price
                   oi.estimated_completion_date,  -- Add estimated completion date
                   GROUP_CONCAT(cs.service_name SEPARATOR ', ') AS service_name,
                   GROUP_CONCAT(cs.service_description SEPARATOR '; ') AS service_descriptions,
                   oi.additional_request  -- Add additional requests
            FROM orders o
            JOIN customer_info ci ON o.customer_id = ci.customer_id
            JOIN customer c ON ci.customer_id = c.customer_id
            JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
            JOIN employee_info e ON o.employee_id = e.employee_id
            JOIN order_status os ON o.order_id = os.order_id
            LEFT JOIN order_services os2 ON o.order_id = os2.order_id
            LEFT JOIN common_services cs ON os2.service_id = cs.service_id
            LEFT JOIN order_info oi ON o.order_id = oi.order_id  -- Join order_info
            GROUP BY o.order_id, o.order_date,
                     ci.customer_first_name, ci.customer_last_name,
                     c.customer_email, ci.customer_phone,
                     v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_tag,v.vehicle_mileage,
                     e.employee_first_name, e.employee_last_name,
                     os.order_status,
                     oi.order_total_price,  -- Include in GROUP BY
                     oi.estimated_completion_date,  -- Include in GROUP BY
                     oi.additional_request  -- Include additional request in GROUP BY
          `;
  
      const rows = await db.query(query);
      console.log("Orders fetched from DB:", rows);
      return rows;
    } catch (error) {
      console.error("Error fetching orders from DB:", error);
      throw error;
    }
  };
  

// get order by Id 
const getOrderById = async (orderId) => {
    try {
      const query = `
              SELECT o.order_id, o.order_date, 
                     ci.customer_first_name, ci.customer_last_name, 
                     c.customer_email, ci.customer_phone, 
                     v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_tag, v.vehicle_mileage,
                     e.employee_first_name, e.employee_last_name,
                     os.order_status AS order_status,
                     oi.order_total_price,  -- Add total price
                     oi.estimated_completion_date,  -- Add estimated completion date
                     oi.additional_request,  -- Add additional request
                     c.active_customer,  -- Add active customer status
                     GROUP_CONCAT(cs.service_name SEPARATOR ', ') AS service_name,
                     GROUP_CONCAT(cs.service_description SEPARATOR '; ') AS service_descriptions
              FROM orders o
              JOIN customer_info ci ON o.customer_id = ci.customer_id
              JOIN customer c ON ci.customer_id = c.customer_id
              JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id
              JOIN employee_info e ON o.employee_id = e.employee_id
              JOIN order_status os ON o.order_id = os.order_id
              LEFT JOIN order_services os2 ON o.order_id = os2.order_id
              LEFT JOIN common_services cs ON os2.service_id = cs.service_id
              LEFT JOIN order_info oi ON o.order_id = oi.order_id  -- Join order_info
              WHERE o.order_id = ?
              GROUP BY o.order_id, o.order_date, 
                       ci.customer_first_name, ci.customer_last_name, 
                       c.customer_email, ci.customer_phone, 
                       v.vehicle_make, v.vehicle_model, v.vehicle_year, v.vehicle_tag, v.vehicle_mileage,
                       e.employee_first_name, e.employee_last_name,
                       os.order_status,
                       oi.order_total_price,  -- Include in GROUP BY
                       oi.estimated_completion_date,  -- Include in GROUP BY
                       oi.additional_request,  -- Include additional request in GROUP BY
                       c.active_customer  -- Include active_customer in GROUP BY
            `;
  
      const rows = await db.query(query, [orderId]);
  
      if (rows.length === 0) {
        throw new Error("Order not found");
      }
  
      return rows[0]; // Return the first (and only) order
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      throw error;
    }
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
