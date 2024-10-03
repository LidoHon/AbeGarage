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

// A function to send get request to get all customers
const getAllCustomers = async (token, searchQuery = "") => {
    // Fallback to specific tokens based on the type of user
    const accessToken = token || localStorage.getItem("employee_token");

    if (!accessToken) {
        throw new Error("No access token found");
    }

    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": accessToken,
        },
    };

    const url = searchQuery 
        ? `${api_url}/api/customers?search=${searchQuery}` 
        : `${api_url}/api/customers`;

    const response = await fetch(url, requestOptions);
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

// Export all the functions

const customerService = {
    createCustomer,
    getAllCustomers,
    deleteCustomer,
    updateCustomer,
    getCustomer,
    getCustomerVehicles, 
    getCustomerOrders,    
};
export default customerService;
