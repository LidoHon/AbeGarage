// Import from the env
const api_url = import.meta.env.VITE_API_URL;
// A function to send post request to create a new employee
const createEmployee = async (formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInEmployeeToken,
    },
    body: JSON.stringify(formData),
  };
  console.log(requestOptions);
  const response = await fetch(`${api_url}/api/employee`, requestOptions);
  return response;
};

// A function to send get request to get all employees
const getAllEmployees = async (token) => {
  // console.log(token);
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(`${api_url}/api/employees`, requestOptions);
  return response;
};

// A function to get an employee by ID
const getEmployeeById = async (employeeId, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token, // Make sure the token is passed for authentication
    },
  };
  
  try {
    const response = await fetch(`${api_url}/api/employees/${employeeId}`, requestOptions);

    if (!response.ok) {
      throw new Error("Failed to fetch employee details.");
    }

    return response;
  } catch (error) {
    console.error("Error fetching employee by ID:", error);
    throw error;
  }
};

// A function to send DELETE request to remove an employee
const deleteEmployee = async (employeeId, token) => {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(
    `${api_url}/api/employees/${employeeId}`,
    requestOptions
  );
  return response;
};

// A function to send put request to update an employee
const updateEmployee = async (employeeId, formData, loggedInEmployeeToken) => {
  const requestOptions = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": loggedInEmployeeToken,
    },
    body: JSON.stringify(formData),
  };
  const response = await fetch(
    `${api_url}/api/employees/${employeeId}`,
    requestOptions
  );
  return response;
};

// A function to send get request to get an employee by ID
const getEmployee = async (employeeId, token) => {
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "x-access-token": token,
    },
  };
  const response = await fetch(
    `${api_url}/api/employees/${employeeId}`,
    requestOptions
  );
  return response;
};


// Fetch tasks assigned to the employee
const getEmployeeTasks = async (employee_id, token) => {
  try {
    const response = await fetch(`${api_url}/api/employees/${employee_id}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error("Error fetching employee tasks:", error);
    throw error;
  }
};

// Function to update task status 

const updateTaskStatus = async (task_id, status, token) => {
  // Map string status to corresponding integer values
  const statusMap = {
    "Received": 1,
    "In Progress": 2,
    "Completed": 3,
  };

  // Log the status received from the UI
  console.log(`[UpdateTaskStatus] Status received from UI: ${status}`);

  // Map the string status to its corresponding integer value
  const mappedStatus = statusMap[status];
  
  // Ensure that the mapped status is valid before sending the request
  if (mappedStatus === undefined) {
    console.error(`[UpdateTaskStatus] Invalid status value: ${status}`);
    throw new Error("Invalid status value");
  }

  try {
    console.log(`[UpdateTaskStatus] Sending PUT request to: ${api_url}/employees/tasks/${task_id}/status`);
    
    const response = await fetch(`${api_url}/employees/tasks/${task_id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: mappedStatus }), // Send the mapped integer status here
    });

    console.log(`[UpdateTaskStatus] Response status: ${response.status}`);

    if (!response.ok) {
      const errorMsg = `Failed to update task status. Status: ${response.status}, StatusText: ${response.statusText}`;
      console.error(`[UpdateTaskStatus] ${errorMsg}`);
      throw new Error(errorMsg);
    }

    const data = await response.json();
    console.log(`[UpdateTaskStatus] Task status updated successfully. Response data:`, data);

    return data;
  } catch (error) {
    console.error(`[UpdateTaskStatus] Error occurred while updating task status:`, error);
    throw error;
  }
};




// Export all the functions
const employeeService = {
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  deleteEmployee,
  updateEmployee,
  getEmployee,
  getEmployeeTasks,
  updateTaskStatus
};
export default employeeService;
