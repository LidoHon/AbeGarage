const api_url = import.meta.env.VITE_API_URL; 

// Function to fetch all services
const getAllServices = async () => {
    console.log(`Fetching services from: ${api_url}/api/services`);
    const response = await fetch(`${api_url}/api/services`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('employee_token')}`
        }
    });

    console.log('Raw response from the API:', response);
    
    const parsedResponse = await response.json();
    console.log('Parsed response data:', parsedResponse);
    
    if (parsedResponse.status !== 'success' || !parsedResponse.services) {
        console.error('Failed to fetch services:', parsedResponse);
        throw new Error('Failed to fetch services. Status: ' + parsedResponse.status);
    }

    console.log('Services data received:', parsedResponse.services);
    return parsedResponse;
};

// Function to add a new service
const addService = async (serviceData) => {
    const response = await fetch(`${api_url}/api/services`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('employee_token')}`
        },
        body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
        throw new Error('Failed to add service');
    }

    return response.json();
};

// Function to delete a service
const deleteService = async (serviceId) => {
    const response = await fetch(`${api_url}/api/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('employee_token')}`
        }
    });

    if (!response.ok) {
        throw new Error('Failed to delete service');
    }

    return response.json();
};

// Function to update a service
const updateService = async (serviceId, serviceData) => {
    const response = await fetch(`${api_url}/api/services/${serviceId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('employee_token')}`
        },
        body: JSON.stringify(serviceData)
    });

    if (!response.ok) {
        throw new Error('Failed to update service');
    }

    return response.json();
};

// Export the service functions
const serviceService = {
    getAllServices,
    addService,
    deleteService,
    updateService
};

export default serviceService;
