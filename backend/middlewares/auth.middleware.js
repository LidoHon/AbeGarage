require('dotenv').config();
const jwt = require("jsonwebtoken");
const employeeService = require("../services/employee.service");
const customerService = require("../services/customer.service");

// A function to verify the token received from the frontend 
const verifyToken = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1]; 
  if (!token) {
    return res.status(403).json({
      status: "fail",
      message: "No token provided!"
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        status: "fail",
        message: "Unauthorized!"
      });
    }

    // Check the type of user (employee or customer)
    if (decoded.type === "employee") {
      req.employee_email = decoded.employee_email;
      req.employee_id = decoded.employee_id; 
      req.employee_role = decoded.employee_role; 
    } else if (decoded.type === "customer") {
      req.customer_email = decoded.customer_email;
      req.customer_id = decoded.customer_id; 
    } else {
      return res.status(403).json({
        status: "fail",
        message: "Invalid token type!"
      });
    }

    next();
  });
}

// A function to check if the user is an admin (only for employees)
const isAdmin = async (req, res, next) => {
  const employee_email = req.employee_email;

  if (!employee_email) {
    return res.status(403).json({
      status: "fail",
      error: "Not an employee!"
    });
  }

  try {
    const employee = await employeeService.getEmployeeByEmail(employee_email);

    if (!employee || employee.length === 0) {
      return res.status(404).json({
        status: "fail",
        error: "Employee not found!"
      });
    }

    // Check if the employee is an admin (role 3)
    if (employee[0].company_role_id === 3) { 
      next();
    } else {
      return res.status(403).json({
        status: "fail",
        error: "Not an Admin!"
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      error: "Error while checking admin access!"
    });
  }
}

const authMiddleware = {
  verifyToken,
  isAdmin
}

module.exports = authMiddleware;
