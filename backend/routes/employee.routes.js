// Import the express module
const express = require("express");
// Call the router method from express to create the router
const router = express.Router();
// Import the employee controller
const employeeController = require("../controllers/employee.controller");
// Import middleware
const authMiddleware = require("../middlewares/auth.middleware");
// Create a route to handle the add employee request on post
router.post(
  "/api/employee",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],

  employeeController.createEmployee
);
// router.post("/api/employee", employeeController.createEmployee);


// Create a route to handle the get all employees request on get
router.get(
  "/api/employees",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],

  employeeController.getAllEmployees
);

// Create a route to handle getting an employee by ID
router.get(
  "/api/employees/:id", 
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.getEmployeeById
);

// Create a route to handle getting an employee by role
router.get("/api/employees/role/:roleId", employeeController.getEmployeesByRole);

// Fetch tasks assigned to the employee 
router.get("/api/employees/:employee_id/tasks", employeeController.getEmployeeTasks);

// Update task status
router.put("/api/employees/tasks/:task_id/status", employeeController.updateTaskStatus);

router.put(
  "/api/employees/:id",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.updateEmployee
);

router.delete(
  "/api/employees/:id",
  // [authMiddleware.verifyToken, authMiddleware.isAdmin],
  employeeController.deleteEmployee
);

// Export the router
module.exports = router;
