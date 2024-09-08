// Import from the env
const api_url = import.meta.env.VITE_API_URL;

// A function to send POST request to create a new vehicle
const createVehicle = async (formData) => {
    const { employee } = useAuth();  // Get employee from AuthContext

    const loggedInEmployeeToken = employee?.employee_token;  // Retrieve the employee token
    console.log("Admin Token (Employee Token):", loggedInEmployeeToken);  // Log the token

    const requestOptions = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": loggedInEmployeeToken,  // Use employee token here
        },
        body: JSON.stringify(formData),
    };

    console.log("Request Options:", requestOptions);  // Ensure that the token is present in the request options

    const response = await fetch(`${api_url}/api/vehicle`, requestOptions);
    console.log("Response from server:", response);  // Log server response

    return response;
};


// A function to send GET request to get all vehicles
const getAllVehicles = async (token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
    const response = await fetch(`${api_url}/api/vehicles`, requestOptions);
    return response;
};

// A function to send DELETE request to remove a vehicle
const deleteVehicle = async (vehicleId, token) => {
    const requestOptions = {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
    const response = await fetch(`${api_url}/api/vehicles/${vehicleId}`, requestOptions);
    return response;
};

// A function to send PUT request to update a vehicle
const updateVehicle = async (vehicleId, formData, loggedInCustomerToken) => {
    const requestOptions = {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": loggedInCustomerToken,
        },
        body: JSON.stringify(formData),
    };
    const response = await fetch(`${api_url}/api/vehicles/${vehicleId}`, requestOptions);
    return response;
};

// A function to send GET request to get a vehicle by ID
const getVehicle = async (vehicleId, token) => {
    const requestOptions = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
        },
    };
    const response = await fetch(`${api_url}/api/vehicles/${vehicleId}`, requestOptions);
    return response;
};

// Export all the functions
const vehicleService = {
    createVehicle,
    getAllVehicles,
    deleteVehicle,
    updateVehicle,
    getVehicle,
};
export default vehicleService;
