// Import the employee service
const employeeService = require("../services/employee.service");
// Create the add employee controller
async function createEmployee(req, res, next) {
  // Check if employee email already exists in the database
  const employeeExists = await employeeService.checkIfEmployeeExists(
    req.body.employee_email
  );
  // If employee exists, send a response to the client
  if (employeeExists) {
    res.status(400).json({
      error: "This email address is already associated with another employee!",
    });
  } else {
    try {
      const employeeData = req.body;
      // Create the employee
      const employee = await employeeService.createEmployee(employeeData);
      if (!employee) {
        res.status(400).json({
          error: "Failed to add the employee!",
        });
      } else {
        res.status(200).json({
          status: "true",
        });
      }
    } catch (error) {
      console.log(error);
      res.status(400).json({
        error: "Something went wrong!",
      });
    }
  }
}

// Create the getAllEmployees controller
async function getAllEmployees(req, res, next) {
  // Call the getAllEmployees method from the employee service
  const employees = await employeeService.getAllEmployees();
  // console.log(employees);
  if (!employees) {
    res.status(400).json({
      error: "Failed to get all employees!",
    });
  } else {
    res.status(200).json({
      status: "success",
      data: employees,
    });
  }
}

// Controller to update an employee
async function updateEmployee(req, res, next) {
  const employee_id = req.params.id;
  const employeeData = req.body;

  try {
    const updated = await employeeService.updateEmployee(
      employee_id,
      employeeData
    );
    if (updated) {
      res.status(200).json({
        status: "success",
        message: "Employee updated successfully!",
      });
    } else {
      res.status(400).json({
        error: "Failed to update the employee!",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: "An error occurred while updating the employee!",
    });
  }
}

// Handle deleting an employee
async function deleteEmployee(req, res) {
  try {
    const employee_id = req.params.id;

    // Call the deleteEmployee method from the employee service
    const result = await employeeService.deleteEmployee(employee_id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "fail",
        message: "Employee not found",
      });
    }

    res.status(200).json({
      status: "success",
      message: `Employee with ID ${employee_id} deleted successfully`,
    });
  } catch (error) {
    console.error("Error deleting employee:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while deleting the employee",
    });
  }
}

// Export the createEmployee controller
module.exports = {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
};
