export const decodeTokenPayload = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
        .join('')
    );

    const decodedPayload = JSON.parse(jsonPayload);
    // console.log("Decoded Payload:", decodedPayload);
    return decodedPayload;
  } catch (error) {
    console.error("Error decoding token:", error);
    return {}; // Return an empty object to avoid undefined errors
  }
};

const getAuth = async () => {
  const storedEmployee = localStorage.getItem("employee");
  const storedCustomer = localStorage.getItem("customer");

  // console.log("Stored Employee Data:", storedEmployee);
  // console.log("Stored Customer Data:", storedCustomer);

  if (storedEmployee) {
    try {
      const parsedEmployee = JSON.parse(storedEmployee);
      // console.log("Parsed Employee from LocalStorage:", parsedEmployee);

      if (parsedEmployee.employee_token) {
        const decodedEmployee = decodeTokenPayload(parsedEmployee.employee_token);
        parsedEmployee.employee_id = decodedEmployee.employee_id;
        // console.log("Decoded Employee Data:", parsedEmployee);
      }

      return parsedEmployee;
    } catch (error) {
      console.error("Failed to parse or decode employee from localStorage:", error);
    }
  }

  if (storedCustomer) {
    try {
      const parsedCustomer = JSON.parse(storedCustomer);
      console.log("Parsed Customer from LocalStorage:", parsedCustomer);

      if (parsedCustomer.customer_token) {
        const decodedCustomer = decodeTokenPayload(parsedCustomer.customer_token);
        console.log("Decoded Customer Payload:", decodedCustomer);

        // Add `customer_id` from the decoded payload to the customer object
        parsedCustomer.customer_id = decodedCustomer.customer_id;

        if (!parsedCustomer.customer_id) {
          console.error("customer_id is missing from decoded token!");
        }
      }

      return parsedCustomer;
    } catch (error) {
      console.error("Failed to parse or decode customer from localStorage:", error);
    }
  }

  console.warn("No valid employee or customer data found in localStorage.");
  return {}; // Return an empty object if nothing is found
};

export default getAuth;
