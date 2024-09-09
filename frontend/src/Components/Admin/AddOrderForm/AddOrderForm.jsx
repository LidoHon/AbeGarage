import { useState, useEffect } from 'react';
import Service from '../../services/order.service';

const AddOrderForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noResults, setNoResults] = useState(false);

    useEffect(() => {
        // Fetch customers once the component mounts
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const response = await Service.getCustomers();
                if (response.status === 'success' && Array.isArray(response.customers)) {
                    setCustomers(response.customers);
                } else {
                    throw new Error('Failed to fetch customers');
                }
            } catch (err) {
                setError('Error fetching customers. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        // Dynamically filter the customers based on the search query
        if (searchQuery) {
            const filtered = customers.filter((customer) =>
                customer.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone_number.includes(searchQuery)
            );
            setFilteredCustomers(filtered);
            setNoResults(filtered.length === 0);
        } else {
            setFilteredCustomers(customers);
            setNoResults(false);
        }
    }, [searchQuery, customers]);

    const handleAddCustomer = () => {
        // Redirect to add customer form
        window.location.href = '/add-customer';
    };

    return (
        <div className="container">
            <h2 className="mb-4">Create a new order</h2>

            <div className="search-bar">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search for a customer using first name, last name, email, or phone number"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="btn btn-danger mt-3" onClick={handleAddCustomer}>
                    Add New Customer
                </button>
            </div>

            {loading && <p>Loading customers...</p>}
            {error && <p className="text-danger">{error}</p>}

            {!loading && !error && (noResults ? (
                <p>No customers found matching your search.</p>
            ) : (
                <table className="table table-hover mt-4">
                    <thead>
                        <tr>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Select</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(filteredCustomers) && filteredCustomers.length > 0 ? (
                            filteredCustomers.map((customer) => (
                                <tr key={customer.id}>
                                    <td>{customer.first_name}</td>
                                    <td>{customer.last_name}</td>
                                    <td>{customer.email}</td>
                                    <td>{customer.phone_number}</td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-primary"
                                            onClick={() => window.location.href = `/customer/${customer.id}/order`}
                                        >
                                            <i className="fa fa-arrow-right"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center">No customers found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            ))}
        </div>
    );
};

export default AddOrderForm;
