// Import from the env
const api_url = import.meta.env.VITE_API_URL;

// Fetch all customers
const getCustomers = async () => {
    const response = await fetch(`${api_url}/api/customers`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('employee_token')}`,
        },
    });

    const data = await response.json();
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }

    return data;
};

export default { getCustomers };
