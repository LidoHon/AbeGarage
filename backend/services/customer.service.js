const conn = require("../config/db.config");
const bcrypt = require("bcrypt");

// A function to check if customer exists in the database
async function checkIfCustomerExists(email) {
  const query = "SELECT * FROM customer WHERE customer_email = ? ";
    const rows = await conn.query(query, [email]);
    console.log(rows);
    if (rows.length > 0) {
        return true;
    }
    return false;
}

// A function to create a new customer
async function createCustomer(customer) {
    let createdCustomer = {};
    try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(customer.customer_password, salt);
    const query =
        "INSERT INTO customer (customer_email, active_customer) VALUES (?, ?)";
    const rows = await conn.query(query, [
        customer.customer_email,
        customer.active_customer,
    ]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
        return false;
    }
    // Get the customer id from the insert
    const customer_id = rows.insertId;
    // Insert the remaining data into the customer_info & customer_pass
    const query2 =
        "INSERT INTO customer_info (customer_id, customer_first_name, customer_last_name, customer_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await conn.query(query2, [
        customer_id,
        customer.customer_first_name,
        customer.customer_last_name,
        customer.customer_phone,
    ]);
    const query3 =
        "INSERT INTO customer_pass (customer_id, customer_password_hashed) VALUES (?, ?)";
    const rows3 = await conn.query(query3, [customer_id, hashedPassword]);

    // Construct the customer object to return
    createdCustomer = {
        customer_id: customer_id,
        };
    } catch (err) {
        console.log(err);
    }
    // Return the customer object
    return createdCustomer;
}

// A function to get the customer by email
async function getCustomerByEmail(customer_email) {
    console.log("Customer email being used for login:", customer_email);

    if (!customer_email) {
        throw new Error("Customer email is undefined or invalid");
    }

    const query = `
    SELECT * 
    FROM customer 
    INNER JOIN customer_info ON customer.customer_id = customer_info.customer_id
    INNER JOIN customer_pass ON customer.customer_id = customer_pass.customer_id
    WHERE customer.customer_email = ?`;

    try {
    const rows = await conn.query(query, [customer_email]);

    if (rows.length === 0) {
        console.log("No customer found with this email:", customer_email);
        return null;
    }

    return rows;
    } catch (error) {
        console.error("Error fetching customer by email:", error);
        throw error;
    }
}


// Modified backend code to handle both listing and searching of customers
async function getAllCustomers(searchQuery = null) { 
  let query = `
  SELECT * 
  FROM customer 
  INNER JOIN customer_info ON customer.customer_id = customer_info.customer_id
  WHERE 1=1
  `;
  const queryParams = [];

  if (searchQuery) {
      const likeSearchQuery = `%${searchQuery}%`;
      query += `
      AND (
          customer_info.customer_first_name LIKE ? 
          OR customer_info.customer_last_name LIKE ? 
          OR customer.customer_email LIKE ? 
          OR customer_info.customer_phone LIKE ?
      )`;
      queryParams.push(likeSearchQuery, likeSearchQuery, likeSearchQuery, likeSearchQuery);
  }

  console.log("Executing query:", query, "with params:", queryParams);

  try {
      const rows = await conn.query(query, queryParams);
      console.log("Fetched rows:", rows);
      return rows;
  } catch (err) {
      console.log("Error fetching customers:", err);
      throw err;
  }
}

// A function to get a specific customer by ID
async function getCustomer(customerId) {
  const query = `
    SELECT * 
    FROM customer 
    INNER JOIN customer_info ON customer.customer_id = customer_info.customer_id
    WHERE customer.customer_id = ?`;

    try {
        const rows = await conn.query(query, [customerId]);

        if (rows.length === 0) {
        console.log("No customer found with this ID:", customerId);
        return null;
        }

        return rows[0];
    } catch (error) {
        console.error("Error fetching customer by ID:", error);
        throw error;
    }
}

// A function to get all vehicles of a specific customer
async function getVehiclesByCustomerId(customerId) {
    const query = `
    SELECT * 
    FROM customer_vehicle_info 
    WHERE customer_id = ?`;

    try {
    const rows = await conn.query(query, [customerId]);

    if (rows.length === 0) {
        console.log("No vehicles found for this customer:", customerId);
        return [];
        }
        return rows;
    } catch (error) {
        console.error("Error fetching vehicles by customer ID:", error);
        throw error;
    }
}

// A function to get all orders of a specific customer
async function getOrdersByCustomerId(customerId) {
  const query = `
    SELECT * 
    FROM orders 
    WHERE customer_id = ?`;

    try {
        const rows = await conn.query(query, [customerId]);

        if (rows.length === 0) {
            console.log("No orders found for this customer:", customerId);
            return [];
        }

        return rows; 
    } catch (error) {
        console.error("Error fetching orders by customer ID:", error);
        throw error;
    }
}

// Function to update a customer's details
async function updateCustomer(customer_id, customerData) {
  try {
    console.log("Customer data received for update:", customerData);

    if (customerData.customer_email) {
      const query1 =
        "UPDATE customer SET customer_email = ? WHERE customer_id = ?";
      await conn
        .query(query1, [customerData.customer_email, customer_id])
        .catch((err) => console.log("Error in updating customer email:", err));
    }

    const query2 =
      "UPDATE customer_info SET customer_first_name = ?, customer_last_name = ?, customer_phone = ? WHERE customer_id = ?";
    await conn
      .query(query2, [
        customerData.customer_first_name,
        customerData.customer_last_name,
        customerData.customer_phone,
        customer_id,
      ])
      .catch((err) => console.log("Error in updating customer info:", err));

    if (customerData.customer_password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        customerData.customer_password,
        salt
      );
      const query3 =
        "UPDATE customer_pass SET customer_password_hashed = ? WHERE customer_id = ?";
      await conn
        .query(query3, [hashedPassword, customer_id])
        .catch((err) =>
          console.log("Error in updating customer password:", err)
        );
    }

    return true;
  } catch (err) {
    console.log("Error updating customer:", err);
    throw err;
  }
}

// Service to delete a customer
async function deleteCustomer(customerId) {
  try {
    const query = "DELETE FROM customer WHERE customer_id = ?";
    const result = await conn.query(query, [customerId]);

    if (result.affectedRows === 0) {
      throw new Error("Customer not found");
    }

    return result;
  } catch (error) {
    console.error("Error deleting customer:", error);
    throw error;
  }
}

// Export the functions for use in the controller
module.exports = {
    checkIfCustomerExists,
    createCustomer,
    getCustomerByEmail,
    getAllCustomers,
    getCustomer,             
    getVehiclesByCustomerId,  
    getOrdersByCustomerId,    
    updateCustomer,
    deleteCustomer,
};
