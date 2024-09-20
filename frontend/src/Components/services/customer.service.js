// Import from the env
const api_url = import.meta.env.VITE_API_URL;
// A function to send post request to create a new customer
const createCustomer = async (formData, loggedInCustomerToken) => {
    const requestOptions = {
        method: "POST",
        headers: {
        "Content-Type": "application/json",
        "x-access-token": loggedInCustomerToken,
        },
        body: JSON.stringify(formData),
    };
    console.log(requestOptions);
    const response = await fetch(`${api_url}/api/customer`, requestOptions);
    return response;
};

// A function to send get request to get all employees
const getAllCustomers = async (token) => {
  // console.log(token);
    const requestOptions = {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        },
    };
    const response = await fetch(`${api_url}/api/customers`, requestOptions);
    return response;
};

// A function to send DELETE request to remove a customer
const deleteCustomer = async (customerId, token) => {
    const requestOptions = {
        method: "DELETE",
        headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        },
    };
    const response = await fetch(
        `${api_url}/api/customers/${customerId}`,
        requestOptions
    );
    return response;
};

// A function to send put request to update a customer
const updateCustomer = async (customerId, formData, loggedInCustomerToken) => {
    const requestOptions = {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        "x-access-token": loggedInCustomerToken,
        },
        body: JSON.stringify(formData),
    };
    const response = await fetch(
        `${api_url}/api/customers/${customerId}`,
        requestOptions
    );
    return response;
};

// A function to send get request to get a customer by ID
const getCustomer = async (customerId, token) => {
    const requestOptions = {
        method: "GET",
        headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
        },
    };
    const response = await fetch(
        `${api_url}/api/customers/${customerId}`,
        requestOptions
    );
    return response;
};

// A function to fetch all vehicles for a customer by customer ID
const getCustomerVehicles = async (customerId, token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
    const response = await fetch(`${api_url}/api/customers/${customerId}/vehicles`, requestOptions);
    return response;
};

// A function to fetch all orders for a customer by customer ID
const getCustomerOrders = async (customerId, token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
    const response = await fetch(`${api_url}/api/customers/${customerId}/orders`, requestOptions);
    return response;
};

const getRequestedServicesForOrder = async (orderId, token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
    const response = await fetch(`${api_url}/api/orders/${orderId}/services`, requestOptions);
    return response;
};

// Exporting the complete customerService object
const customerService = {
    createCustomer,
    getAllCustomers,
    deleteCustomer,
    updateCustomer,
    getCustomer,
    getCustomerVehicles,
    getCustomerOrders,
    getRequestedServicesForOrder,
};

export default customerService;
