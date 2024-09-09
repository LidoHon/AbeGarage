import { useState, useEffect } from 'react';
import Service from '../../services/order.service';
import UpdateCustomerForm from '../customerList/updateCustomer';
import { Modal } from 'react-bootstrap';

const AddOrderForm = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    // Track selected customer
    const [selectedCustomer, setSelectedCustomer] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [noResults, setNoResults] = useState(false);
    // State to control modal visibility
    const [showEditModal, setShowEditModal] = useState(false); 

    useEffect(() => {
        if (searchQuery) {
            const fetchCustomers = async () => {
                setLoading(true);
                try {
                    const response = await Service.getCustomers(searchQuery);
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
        }
    }, [searchQuery]);

    useEffect(() => {
        if (searchQuery) {
            const filtered = customers.filter((customer) =>
                (customer.customer_first_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (customer.customer_last_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (customer.customer_email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                (customer.customer_phone || '').includes(searchQuery)
            );
            setFilteredCustomers(filtered);
            setNoResults(filtered.length === 0);
        } else {
            setFilteredCustomers([]);
            setNoResults(false);
        }
    }, [searchQuery, customers]);

    const handleAddCustomer = () => {
        window.location.href = '/admin/add-customer';
    };

    // Handle customer selection
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
    };

    // Handle edit customer button click to show modal
    const handleEditCustomer = () => {
        setShowEditModal(true);
    };

    // Handle success callback after customer update, 
    const handleUpdateSuccess = (updatedCustomer) => {
        setSelectedCustomer(updatedCustomer);
        setShowEditModal(false);
    };

    return (
        <div className="container">
            <h2 className="mb-4">Create a new order</h2>

            {/* If a customer is selected, show the customer details instead of the search bar */}
            {selectedCustomer ? (
                <div className="selected-customer-details card p-3">
                    <div className="row">
                        <div className="col-10">
                            <h3>{selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}</h3>
                            <p><strong>Email:</strong> {selectedCustomer.customer_email}</p>
                            <p><strong>Phone Number:</strong> {selectedCustomer.customer_phone}</p>
                            <p><strong>Active Customer:</strong> {selectedCustomer.active_customer ? 'Yes' : 'No'}</p>
                        </div>
                        <div className="col-2 text-right">
                            <button className="btn btn-sm btn-danger" onClick={() => setSelectedCustomer(null)}>
                                <i className="fa fa-times"></i>
                            </button>
                        </div>
                    </div>
                    <div>
                        <button onClick={handleEditCustomer} className="btn btn-link text-danger">
                            <i className="fa fa-pencil"></i> Edit customer info
                        </button>
                    </div>

                    {/* Modal for updating customer */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Customer Information</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <UpdateCustomerForm
                                customer={selectedCustomer}
                                onClose={() => setShowEditModal(false)}
                                // Pass updated customer on success
                                onSuccess={handleUpdateSuccess} 
                            />
                        </Modal.Body>
                    </Modal>
                </div>
            ) : (
                <>
                    {/* Search bar */}
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

                    {/* Loading and error messages */}
                    {loading && <p>Loading customers...</p>}
                    {error && <p className="text-danger">{error}</p>}

                    {/* Customer list table */}
                    {!loading && !error && searchQuery && (
                        noResults ? (
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
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer.customer_id}>
                                            <td>{customer.customer_first_name}</td>
                                            <td>{customer.customer_last_name}</td>
                                            <td>{customer.customer_email}</td>
                                            <td>{customer.customer_phone}</td>
                                            <td>
                                                <button
                                                    className="btn btn-sm btn-primary"
                                                    onClick={() => handleSelectCustomer(customer)}
                                                >
                                                    <i className="fa fa-arrow-right"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )
                    )}
                </>
            )}
        </div>
    );
};

export default AddOrderForm;
