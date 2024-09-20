const api_url = import.meta.env.VITE_API_URL;

// A function to send the login request for an employee
const logInEmployee = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };
  console.log("Sending employee login request");
  console.log(requestOptions.body);
  const response = await fetch(`${api_url}/api/employee/login`, requestOptions);
  return response;
};

// A function to send the login request for a customer
const logInCustomer = async (formData) => {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };
  console.log("Sending customer login request");
  console.log(requestOptions.body);
  const response = await fetch(`${api_url}/api/customer/login`, requestOptions);
  return response;
};

// A function to log out the employee or customer based on their type
const logOut = (userType) => {
  if (userType === "employee") {
    localStorage.removeItem("employee_token");
  } else if (userType === "customer") {
    localStorage.removeItem("customer_token");
  }
};

// Export the functions
export const loginService = {
  logInEmployee,
  logInCustomer,
  logOut,
};
