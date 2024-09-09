const api_url = import.meta.env.VITE_API_URL;

const getCustomers = async (searchQuery = '') => {
    console.log("Search Query in Service:", searchQuery); // Log search query
    const response = await fetch(`${api_url}/api/customers?search=${searchQuery}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('employee_token')}`,
        },
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }

    const data = await response.json();
    console.log("Data received from API:", data);

    return data;
};

export default { getCustomers };

