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

// Controller to get employee by ID
async function getEmployeeById(req, res, next) {
  const employeeId = req.params.id;
  
  try {
    const employee = await employeeService.getEmployeeById(employeeId);

    if (!employee) {
      return res.status(404).json({
        status: "fail",
        message: `Employee with ID ${employeeId} not found`,
      });
    }

    res.status(200).json({
      status: "success",
      data: employee,
    });
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    res.status(500).json({
      status: "error",
      message: "An error occurred while fetching the employee",
    });
  }
}

// Controller to get employees by their role
async function getEmployeesByRole(req, res) {
  const { roleId } = req.params;
  console.log(`[Controller] Received request to fetch employees with roleId: ${roleId}`);

  if (!roleId) {
    console.log(`[Controller] Missing roleId in request.`);
    return res.status(400).json({
      status: 'fail',
      message: 'Role ID is required',
    });
  }

  try {
    const employees = await employeeService.getEmployeesByRole(roleId);
    console.log(`[Controller] Employees fetched:`, employees);

    if (employees.length === 0) {
      console.log(`[Controller] No employees found for roleId: ${roleId}`);
      return res.status(404).json({
        status: 'fail',
        message: 'No employees found for this role',
      });
    }

    res.status(200).json({
      status: 'success',
      data: employees,
    });
    console.log(`[Controller] Response sent successfully for roleId: ${roleId}`);
  } catch (error) {
    console.error(`[Controller] Error fetching employees by roleId: ${roleId}. Error:`, error);
    res.status(500).json({
      status: "fail",
      message: "Failed to get employees by role",
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

// Get tasks assigned to a specific employee
const getEmployeeTasks = async (req, res) => {
  try {
    const { employee_id } = req.params;
    console.log(`Fetching tasks for employee_id: ${employee_id}`);

    const tasks = await employeeService.getEmployeeTasks(employee_id);
    console.log(`Tasks fetched for employee_id: ${employee_id}`, tasks);

    res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    res.status(500).json({ message: "Error fetching employee tasks" });
  }
};


// Update task status with detailed logging
const updateTaskStatus = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status } = req.body;

    // Log incoming request values
    console.log(`[UpdateTaskStatus Controller] Received request with Task ID: ${task_id}, Status: ${status}`);

    // Ensure status is parsed as a number
    const parsedStatus = Number(status);  // Convert status to a number

    // Ensure status is between 1 and 3
    if (![1, 2, 3].includes(parsedStatus)) {
      console.warn(`[UpdateTaskStatus Controller] Invalid status value provided: ${parsedStatus}`);
      return res.status(400).json({ message: "Invalid status value" });
    }

    // Proceed with updating the task status
    const result = await employeeService.updateTaskStatus(task_id, parsedStatus);
    console.log(`[UpdateTaskStatus Controller] Task ID: ${task_id} status updated successfully to ${parsedStatus}`);
    res.status(200).json({ message: "Task status updated successfully" });

  } catch (error) {
    console.error(`[UpdateTaskStatus Controller] Error occurred while updating task status for Task ID: ${task_id}`, error);
    res.status(500).json({ message: "Error updating task status" });
  }
};





// Export the createEmployee controller
module.exports = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  getEmployeesByRole,
  updateEmployee,
  deleteEmployee,
  updateTaskStatus,
  getEmployeeTasks,
};
