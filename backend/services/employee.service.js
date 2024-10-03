const conn = require("../config/db.config");
const bcrypt = require("bcrypt");
// A function to check if employee exists in the database
async function checkIfEmployeeExists(email) {
  const query = "SELECT * FROM employee WHERE employee_email = ? ";
  const rows = await conn.query(query, [email]);
  console.log(rows);
  if (rows.length > 0) {
    return true;
  }
  return false;
}

// A function to create a new employee
async function createEmployee(employee) {
  let createdEmployee = {};
  try {
    // Generate a salt and hash the password
    const salt = await bcrypt.genSalt(10);
    // Hash the password
    const hashedPassword = await bcrypt.hash(employee.employee_password, salt);
    // Insert the email in to the employee table
    const query =
      "INSERT INTO employee (employee_email, active_employee) VALUES (?, ?)";
    const rows = await conn.query(query, [
      employee.employee_email,
      employee.active_employee,
    ]);
    console.log(rows);
    if (rows.affectedRows !== 1) {
      return false;
    }
    // Get the employee id from the insert
    const employee_id = rows.insertId;
    // Insert the remaining data in to the employee_info, employee_pass, and employee_role tables
    const query2 =
      "INSERT INTO employee_info (employee_id, employee_first_name, employee_last_name, employee_phone) VALUES (?, ?, ?, ?)";
    const rows2 = await conn.query(query2, [
      employee_id,
      employee.employee_first_name,
      employee.employee_last_name,
      employee.employee_phone,
    ]);
    const query3 =
      "INSERT INTO employee_pass (employee_id, employee_password_hashed) VALUES (?, ?)";
    const rows3 = await conn.query(query3, [employee_id, hashedPassword]);
    const query4 =
      "INSERT INTO employee_role (employee_id, company_role_id) VALUES (?, ?)";
    const rows4 = await conn.query(query4, [
      employee_id,
      employee.company_role_id,
    ]);
    createdEmployee = {
      employee_id: employee_id,
    };
  } catch (err) {
    console.log(err);
  }
  // Return the employee object
  return createdEmployee;
}
// a function to get the employee by email
async function getEmployeeByEmail(employee_email) {
  const query =
    "SELECT * FROM employee INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id INNER JOIN employee_pass ON employee.employee_id = employee_pass.employee_id INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id WHERE employee.employee_email = ?";
  const rows = await conn.query(query, [employee_email]);
  return rows;
}

//get
async function getAllEmployees() {
  const query = `SELECT * 
                 FROM employee 
                 INNER JOIN employee_info ON employee.employee_id = employee_info.employee_id 
                 INNER JOIN employee_role ON employee.employee_id = employee_role.employee_id 
                 ORDER BY employee.employee_id`;
  try {
    const rows = await conn.query(query);
    return rows;
  } catch (err) {
    console.log("Error fetching employees:", err);
    throw err;
  }
}

// Service function to get an employee by ID
async function getEmployeeById(employeeId) {
  const query = `
    SELECT e.*, ei.employee_first_name, ei.employee_last_name, ei.employee_phone, er.company_role_id 
    FROM employee e
    INNER JOIN employee_info ei ON e.employee_id = ei.employee_id
    INNER JOIN employee_role er ON e.employee_id = er.employee_id
    WHERE e.employee_id = ?`;

  try {
    const rows = await conn.query(query, [employeeId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0]; 
  } catch (err) {
    console.log("Error fetching employee by ID:", err);
    throw err;
  }
}

// Service function to fetch employees by role
async function getEmployeesByRole(roleId) {
  console.log(`[Service] Database query: Fetching employees for roleId: ${roleId}`);

  const query = `
    SELECT e.employee_id, e.employee_email, ei.employee_first_name, ei.employee_last_name
    FROM employee e
    JOIN employee_info ei ON e.employee_id = ei.employee_id
    JOIN employee_role er ON e.employee_id = er.employee_id
    WHERE er.company_role_id = ?`;

  try {
    const rows = await conn.query(query, [roleId]);
    console.log(`[Service] Database response for roleId ${roleId}:`, rows);
    return rows;
  } catch (error) {
    console.error(`[Service] Database query error for roleId ${roleId}:`, error);
    throw error;
  }
}


// Function to update an employee's details
async function updateEmployee(employee_id, employeeData) {
  try {
    // Log the employee data to ensure it is passed correctly
    console.log("Employee data received for update:", employeeData);

    // Update employee email, if provided
    if (employeeData.employee_email) {
      const query1 =
        "UPDATE employee SET employee_email = ? WHERE employee_id = ?";
      await conn
        .query(query1, [employeeData.employee_email, employee_id])
        .catch((err) => console.log("Error in updating employee email:", err));
    }

    // Update employee info (first name, last name, phone)
    const query2 =
      "UPDATE employee_info SET employee_first_name = ?, employee_last_name = ?, employee_phone = ? WHERE employee_id = ?";
    await conn
      .query(query2, [
        employeeData.employee_first_name,
        employeeData.employee_last_name,
        employeeData.employee_phone,
        employee_id,
      ])
      .catch((err) => console.log("Error in updating employee info:", err));

    // Update employee role, if provided
    if (employeeData.company_role_id) {
      const query3 =
        "UPDATE employee_role SET company_role_id = ? WHERE employee_id = ?";
      await conn
        .query(query3, [employeeData.company_role_id, employee_id])
        .catch((err) => console.log("Error in updating employee role:", err));
    }

    // If password needs to be updated
    if (employeeData.employee_password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(
        employeeData.employee_password,
        salt
      );
      const query4 =
        "UPDATE employee_pass SET employee_password_hashed = ? WHERE employee_id = ?";
      await conn
        .query(query4, [hashedPassword, employee_id])
        .catch((err) =>
          console.log("Error in updating employee password:", err)
        );
    }

    return true;
  } catch (err) {
    console.log("Error updating employee:", err);
    throw err;
  }
}

// Service to delete an employee
async function deleteEmployee(employeeId) {
  try {
    // Example query to delete an employee
    const query = "DELETE FROM employee WHERE employee_id = ?";
    const result = await conn.query(query, [employeeId]);

    if (result.affectedRows === 0) {
      throw new Error("Employee not found");
    }

    return result;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error; 
  }
}

// Fetch tasks assigned to the employee, including customer and vehicle details
const getEmployeeTasks = async (employee_id) => {
  const query = `
        SELECT
        ose.order_service_employee_id,
        os.service_id,
        cs.service_name,
        cs.service_description,
        os.service_completed,
        o.order_id,
        os.order_service_id,
        ords.order_status,
        c.customer_id,
        c.customer_email,  
        ci.customer_first_name,
        ci.customer_last_name,
        ci.customer_phone,
        v.vehicle_id,
        v.vehicle_make,
        v.vehicle_model,
        v.vehicle_year,
        v.vehicle_mileage,
        v.vehicle_tag
    FROM order_service_employee ose
    INNER JOIN order_services os ON ose.order_service_id = os.order_service_id
    INNER JOIN common_services cs ON os.service_id = cs.service_id
    INNER JOIN orders o ON os.order_id = o.order_id
    LEFT JOIN (
        SELECT order_service_id, MAX(order_status) as order_status 
        FROM order_status
        GROUP BY order_service_id
    ) ords ON ords.order_service_id = os.order_service_id
    INNER JOIN customer c ON o.customer_id = c.customer_id  
    INNER JOIN customer_info ci ON c.customer_id = ci.customer_id  
    INNER JOIN customer_vehicle_info v ON o.vehicle_id = v.vehicle_id  
    WHERE ose.employee_id = ?;
  `;

  try {
    console.log(`Executing query for employee_id: ${employee_id}`);

    const rows = await conn.query(query, [employee_id]);
    console.log(`Rows fetched for employee_id: ${employee_id}`, rows);

    if (rows.length === 0) {
      console.warn(`No tasks found for employee_id: ${employee_id}`);
      throw new Error('No tasks found for the given employee');
    }

    return rows;  // Return the result set
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    throw error;
  }
};

// Update task status
// Function to update task (order service) status
const updateTaskStatus = async (task_id, status) => {
  try {
    console.log(`[Service] Updating task (order_service_id: ${task_id}) to status: ${status}`);

    // Ensure status is valid (1 = Received, 2 = In Progress, 3 = Completed)
    if (![1, 2, 3].includes(status)) {
      throw new Error(`Invalid status value: ${status}`);
    }

    // Update the service (task) status in `order_services`
    const updateServiceQuery = `
      UPDATE order_services
      SET service_completed = ?
      WHERE order_service_id = ?
    `;
    const serviceCompletedValue = status === 3 ? 1 : 0; 
    const result = await conn.query(updateServiceQuery, [serviceCompletedValue, task_id]);

    if (result.affectedRows === 0) {
      throw new Error(`No task found with ID: ${task_id}`);
    }

    // Update the status in `order_status` for this specific service
    const updateStatusQuery = `
      UPDATE order_status
      SET order_status = ?
      WHERE order_service_id = ?
    `;
    await conn.query(updateStatusQuery, [status, task_id]);

    // Fetch the order ID associated with this service
    const getOrderQuery = `
      SELECT order_id FROM order_services WHERE order_service_id = ?
    `;
    const orderRow = await conn.query(getOrderQuery, [task_id]);
    const orderId = orderRow[0]?.order_id;

    if (!orderId) {
      throw new Error(`No order found for task ID: ${task_id}`);
    }

    // Check if all services in the order are completed
    const checkCompletionQuery = `
      SELECT service_completed
      FROM order_services
      WHERE order_id = ?
    `;
    const services = await conn.query(checkCompletionQuery, [orderId]);

    const allCompleted = services.every((service) => service.service_completed === 1);
    const anyInProgress = services.some((service) => service.service_completed === 0 && status === 2);

    // Update the overall order status based on services' completion status
    let overallOrderStatus = 1; 
    if (allCompleted) {
      overallOrderStatus = 3; 
    } else if (anyInProgress) {
      overallOrderStatus = 2; 
    }

    const updateOrderStatusQuery = `
      UPDATE order_status
      SET order_status = ?
      WHERE order_id = ? AND order_service_id IS NULL
    `;
    await conn.query(updateOrderStatusQuery, [overallOrderStatus, orderId]);

    return { success: true, message: 'Task status updated successfully' };

  } catch (error) {
    console.error(`[Service] Error updating task status for task ID: ${task_id}`, error);
    throw error;
  }
};



// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getEmployeeById,
  getAllEmployees,
  getEmployeesByRole,
  updateEmployee,
  deleteEmployee,
  getEmployeeTasks,
  updateTaskStatus
};
