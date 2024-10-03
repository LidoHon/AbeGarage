const loginService = require("../services/login.service");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Handle employee login
async function logInEmployee(req, res, next) {
  try {
    const employeeData = req.body;
    const employee = await loginService.logInEmployee(employeeData);

    if (employee.status === "fail") {
      return res.status(403).json({ status: employee.status, message: employee.message });
    }

    // Create JWT payload with employee role
    const payload = {
      employee_id: employee.data.employee_id,
      employee_email: employee.data.employee_email,
      employee_first_name: employee.data.employee_first_name,
      employee_role: employee.data.company_role_id, 
      type: "employee"  
    };

    // Generate token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "30d" });

    // Send response with token and employee's first name and role
    res.status(200).json({
      status: "success",
      message: "Employee logged in successfully",
      data: {
        employee_token: token,
        employee_first_name: employee.data.employee_first_name,
        employee_role: employee.data.company_role_id, 
        employee_id: employee.data.employee_id, 
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred during login" });
  }
}

// Handle customer login
async function logInCustomer(req, res, next) {
  try {
    const customerData = req.body;
    const customer = await loginService.logInCustomer(customerData);

    if (customer.status === "fail") {
      return res.status(403).json({ status: customer.status, message: customer.message });
    }

    // Create JWT payload with customer type
    const payload = {
      customer_id: customer.data.customer_id,
      customer_email: customer.data.customer_email,
      customer_first_name: customer.data.customer_first_name,
      type: "customer"  
    };

    // Generate token
    const token = jwt.sign(payload, jwtSecret, { expiresIn: "30d" });

    // Send response with token and customer's first name
    res.status(200).json({
      status: "success",
      message: "Customer logged in successfully",
      data: {
        customer_token: token,
        customer_first_name: customer.data.customer_first_name,
      },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "An error occurred during login" });
  }
}

module.exports = {
  logInEmployee,
  logInCustomer,
};
