import { useState, useEffect } from "react";
import { Table, Modal, Button, Form } from "react-bootstrap";
import { useAuth } from "../../../Contexts/AuthContext";
import { format } from "date-fns";
import customerService from "../../services/customer.service";
import UpdateCustomerForm from "./UpdateCustomer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from "react-router-dom"; 

const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const { employee } = useAuth();

    // Try to fetch token from AuthContext or fallback to localStorage
    const token = employee?.employee_token || localStorage.getItem("employee_token");

    console.log("Token in customerList.jsx:", token); 

    const [searchQuery, setSearchQuery] = useState(''); 

    useEffect(() => {
        const fetchCustomers = async () => {
            if (!token) {
                setApiError(true);
                setApiErrorMessage("No token found, please log in again.");
                return;
            }

            try {
                const res = await customerService.getAllCustomers(token);
                if (!res.ok) {
                    setApiError(true);
                    setApiErrorMessage(getErrorMessage(res.status));
                    return;
                }
                const data = await res.json();
                if (data.customers.length !== 0) {
                    setCustomers(data.customers);
                } else {
                    setApiErrorMessage("No customers found.");
                }
            } catch (err) {
                console.error("Error fetching customers:", err);
                setApiError(true);
                setApiErrorMessage("An error occurred. Please try again later.");
            }
        };
        fetchCustomers();
    }, [token]);

    const getErrorMessage = (status) => {
        switch (status) {
            case 401:
                return "Please login again.";
            case 403:
                return "You are not authorized to view this page.";
            default:
                return "Please try again later.";
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCustomers = customers.filter(customer =>
        customer.customer_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.customer_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.customer_phone.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = async (customerId) => {
        if (window.confirm("Are you sure you want to delete this customer?")) {
            try {
                const res = await customerService.deleteCustomer(customerId, token);
                if (!res.ok) {
                    setApiError(true);
                    setApiErrorMessage(getErrorMessage(res.status));
                    return;
                }
                setCustomers(customers.filter((cust) => cust.customer_id !== customerId));
                toast.success("Customer deleted successfully!");
            } catch (err) {
                setApiError(true);
                setApiErrorMessage("An error occurred. Please try again later.");
                toast.error("Failed to delete customer.");
            }
        }
    };

    const handleEdit = (customer) => {
        setSelectedCustomer(customer);
        setShowModal(true);
    };

    return (
        <div className="container">
            {apiError ? (
                <section className="error-section">
                    <div className="container">
                        <h2>{apiErrorMessage}</h2>
                    </div>
                </section>
            ) : (
                <section className="table-section">
                    <div className="container">
                        <h2>Customers</h2>

                        {/* Search Bar */}
                        <Form className="mb-4">
                            <Form.Control
                                type="text"
                                placeholder="Search for a customer using first name, last name, email, or phone number"
                                value={searchQuery}
                                onChange={handleSearchChange}
                                className="form-control"
                            />
                        </Form>

                        {/* Customers Table */}
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>First Name</th>
                                    <th>Last Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Added Date</th>
                                    <th>Active</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredCustomers.map((customer) => (
                                    <tr key={customer.customer_id}>
                                        {/* Only make specific columns clickable */}
                                        <td>
                                            <Link to={`/admin/customer-profile/${customer.customer_id}`}>
                                                {customer.customer_id}
                                            </Link>
                                        </td>
                                        <td>{customer.customer_first_name}</td>
                                        <td>{customer.customer_last_name}</td>
                                        <td>{customer.customer_email}</td>
                                        <td>{customer.customer_phone}</td>
                                        <td>
                                            {customer.customer_added_date
                                                ? format(new Date(customer.customer_added_date), "MM/dd/yyyy | HH:mm")
                                                : "N/A"}
                                        </td>
                                        <td>{customer.active_customer ? "Yes" : "No"}</td>
                                        <td>
                                            <div className="action-buttons">
                                                <Button variant="primary" onClick={() => handleEdit(customer)}>
                                                    Edit
                                                </Button>
                                                <Button variant="danger" onClick={() => handleDelete(customer.customer_id)}>
                                                    Delete
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </section>
            )}

            {/* Bootstrap Modal for Editing Customer */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Customer</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedCustomer && (
                        <UpdateCustomerForm
                            customer={selectedCustomer}
                            onClose={() => setShowModal(false)}
                            onSuccess={() => {
                                setShowModal(false);
                                window.location.reload();
                                // Refresh customer list or handle success
                            }}
                        />
                    )}
                </Modal.Body>
            </Modal>

            {/* ToastContainer */}
            <ToastContainer />
        </div>
    );
};

export default CustomersList;
