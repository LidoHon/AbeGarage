const api_url = import.meta.env.VITE_API_URL;

const logInEmployee = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };

  const response = await fetch(`${api_url}/api/employee/login`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  // console.log("Parsed data from server:", data);

  if (data.status === "success") {
    const { employee_token, employee_first_name, employee_id, employee_role } = data.data;

    // Ensure employee_id is included in the localStorage object
    const employee = {
      employee_first_name,
      employee_id,
      employee_role,
      employee_token,
    };

    // console.log("Storing employee object in localStorage:", employee);

    localStorage.setItem("employee", JSON.stringify(employee));  

    // Check if the data was correctly stored in localStorage
    const storedEmployee = JSON.parse(localStorage.getItem("employee"));
    // console.log("Employee from localStorage after setting:", storedEmployee);

    if (!storedEmployee || !storedEmployee.employee_id) {
      console.error("Employee ID is missing from localStorage!");
    }
  } else {
    console.log("Login failed:", data.message);
  }
  return data;
};


const logInCustomer = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };

  // console.log("Sending customer login request with form data:", formData);

  const response = await fetch(`${api_url}/api/customer/login`, requestOptions);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }

  const data = await response.json();
  // console.log("Parsed data from server:", data);

  // If customer_id is missing from the response, stop the login process
  if (!data.data.customer_id) {
    console.error("Customer ID is missing from the server response. Login aborted.");
    throw new Error("Customer ID is missing. Cannot log in.");
  }

  if (data.status === "success") {
    const { customer_token, customer_first_name, customer_id } = data.data;

    // Ensure all properties, including customer_id, are included
    const customer = {
      customer_first_name,
      customer_token,
      customer_id,  // Make sure this is included
    };

    // console.log("Storing customer object in localStorage:", customer);
    localStorage.setItem("customer", JSON.stringify(customer));

    // Verify storage
    const storedCustomer = JSON.parse(localStorage.getItem("customer"));
    console.log("Customer object retrieved from localStorage:", storedCustomer);

    if (!storedCustomer || !storedCustomer.customer_id) {
      console.error("Customer ID is missing from localStorage!");
    }
  } else {
    console.log("Login failed:", data.message);
  }

  return data;
};



// A function to log out the employee or customer based on their type
const logOut = () => {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("employee_token");
  localStorage.removeItem("customer");
  localStorage.removeItem("employee");
  // console.log("All tokens and data removed from localStorage.");
};



export const loginService = {
  logInEmployee,
  logInCustomer,
  logOut,
};
