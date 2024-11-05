const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");
const employeeService = require("./employee.service");
const customerService = require("./customer.service");

// Employee login logic
async function logInEmployee(employeeData) {
  try {
    const employee = await employeeService.getEmployeeByEmail(employeeData.email);

    if (!employee || employee.length === 0) {
      return { status: "fail", message: "Employee does not exist" };
    }

    const passwordMatch = await bcrypt.compare(employeeData.password, employee[0].employee_password_hashed);
    if (!passwordMatch) {
      return { status: "fail", message: "Incorrect password" };
    }

    // Generate JWT token
    const token = jwt.sign({
        employee_id: employee[0].employee_id,
        employee_first_name: employee[0].employee_first_name,
        employee_role: employee[0].company_role_id, 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return {
      status: "success",
      data: {
        employee_token: token,
        employee_first_name: employee[0].employee_first_name,
        employee_id: employee[0].employee_id, 
        company_role_id: employee[0].company_role_id 
      }
    };
  } catch (error) {
    throw new Error("Error occurred during employee login: " + error.message);
  }
}

// Customer login logic
async function logInCustomer(customerData) {
  try {
    const customer = await customerService.getCustomerByEmail(customerData.email);

    if (!customer || customer.length === 0) {
      return { status: "fail", message: "Customer does not exist" };
    }

    const passwordMatch = await bcrypt.compare(customerData.password, customer[0].customer_password_hashed);
    if (!passwordMatch) {
      return { status: "fail", message: "Incorrect password" };
    }

    // Generate JWT token
    const token = jwt.sign({
        customer_id: customer[0].customer_id,
        customer_first_name: customer[0].customer_first_name,
        customer_last_name: customer[0].customer_last_name, 
        customer_phone: customer[0].customer_phone
      },
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    return {
      status: "success",
      data: {
        customer_token: token,
        customer_first_name: customer[0].customer_first_name,
        customer_last_name: customer[0].customer_last_name,
        customer_id: customer[0].customer_id,
        customer_phone: customer[0].customer_phone,
        customer_email: customer[0].customer_email
      }
    };
  } catch (error) {
    throw new Error("Error occurred during customer login: " + error.message);
  }
}

module.exports = {
  logInEmployee,
  logInCustomer,
};
