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
    // construct to the employee object to return
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

    // Update employee status, if provided
    if (employeeData.hasOwnProperty("active_employee")) {
      // console.log("Updating active employee status...");
      const query5 =
        "UPDATE employee SET active_employee = ? WHERE employee_id = ?";
      await conn
        .query(query5, [employeeData.active_employee, employee_id])
        .catch((err) =>
          console.log("Error in updating active employee status:", err)
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

    // Example of potential issue if you are destructuring or expecting iterable
    if (result.affectedRows === 0) {
      throw new Error("Employee not found");
    }

    return result;
  } catch (error) {
    console.error("Error deleting employee:", error);
    throw error; // Rethrow the error to be handled elsewhere
  }
}

// Export the functions for use in the controller
module.exports = {
  checkIfEmployeeExists,
  createEmployee,
  getEmployeeByEmail,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};
