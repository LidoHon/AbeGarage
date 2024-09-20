const conn = require("../config/db.config");
const bcrypt = require("bcrypt");
const employeeService = require("./employee.service");
const customerService = require("./customer.service");

// Employee login logic
async function logInEmployee(employeeData) {
  try {
    let returnData = {}; 
    const employee = await employeeService.getEmployeeByEmail(employeeData.email);
    if (employee.length === 0) {
      returnData = { status: "fail", message: "Employee does not exist" };
      return returnData;
    }

    const passwordMatch = await bcrypt.compare(employeeData.password, employee[0].employee_password_hashed);
    if (!passwordMatch) {
      returnData = { status: "fail", message: "Incorrect password" };
      return returnData;
    }

    // Return employee data along with company_role_id (role)
    returnData = { 
      status: "success", 
      data: {
        employee_id: employee[0].employee_id,
        employee_email: employee[0].employee_email,
        employee_first_name: employee[0].employee_first_name,
        company_role_id: employee[0].company_role_id 
      }
    };

    return returnData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


// Customer login logic
async function logInCustomer(customerData) {
  try {
    let returnData = {};
    const customer = await customerService.getCustomerByEmail(customerData.email);
    if (customer.length === 0) {
      returnData = { status: "fail", message: "Customer does not exist" };
      return returnData;
    }
    const passwordMatch = await bcrypt.compare(customerData.password, customer[0].customer_password_hashed);
    if (!passwordMatch) {
      returnData = { status: "fail", message: "Incorrect password" };
      return returnData;
    }
    returnData = { status: "success", data: customer[0] };
    return returnData;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

module.exports = {
  logInEmployee,
  logInCustomer,
};
