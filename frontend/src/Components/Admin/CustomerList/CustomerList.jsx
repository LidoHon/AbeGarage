import { useState, useEffect } from "react";
import { Table, Button, Form, Pagination } from "react-bootstrap";
import { useAuth } from "../../../Contexts/AuthContext";
import { format } from "date-fns";
import customerService from "../../services/customer.service";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; 

const CustomersList = () => {
    const [customers, setCustomers] = useState([]);
    const [apiError, setApiError] = useState(false);
    const [apiErrorMessage, setApiErrorMessage] = useState(null);
    const { employee } = useAuth();
    const [searchQuery, setSearchQuery] = useState(''); 
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 4; 
    const navigate = useNavigate(); // useNavigate hook

    const token = employee?.employee_token || localStorage.getItem("employee_token");

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

    // Navigate to the EditCustomer page
    const handleEdit = (customerId) => {
        navigate(`/admin/customer/${customerId}`);
    };

    // New function to handle navigation to the customer profile
    const handleRowClick = (customerId) => {
        navigate(`/admin/customer-profile/${customerId}`);
    };

    // Pagination Logic
    const indexOfLastCustomer = currentPage * itemsPerPage;
    const indexOfFirstCustomer = indexOfLastCustomer - itemsPerPage;
    const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage); 

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
                    <div className="flex items-center gap-4">
                        <h2 className="page-titles text-3xl font-bold mb-4 mt-4">Customers</h2>
                        <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
                    </div>

                        {/* Search Bar */}
                        <Form className="mb-4">
                            <div className="input-group">
                                <Form.Control
                                    type="text"
                                    placeholder="Search for a customer using first name, last name, email, or phone number"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    className="form-control"
                                />
                                <span className="input-group-text bg-white text-gray-800">
                                    <i className="fas fa-search"></i> {/* Search Icon */}
                                </span>
                            </div>
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
                                    <th>Edit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentCustomers.map((customer) => (
                                    <tr 
                                        key={customer.customer_id} 
                                        style={{ cursor: "pointer" }}
                                        onClick={() => handleRowClick(customer.customer_id)} // Navigate to customer profile
                                    >
                                        <td>{customer.customer_id}</td>
                                        <td><strong>{customer.customer_first_name}</strong></td>
                                        <td><strong>{customer.customer_last_name}</strong></td>
                                        <td>{customer.customer_email}</td>
                                        <td>{customer.customer_phone}</td>
                                        <td>
                                            {customer.customer_added_date
                                                ? format(new Date(customer.customer_added_date), "MM/dd/yyyy | HH:mm")
                                                : "N/A"}
                                        </td>
                                        <td>{customer.active_customer ? "Yes" : "No"}</td>
                                        <td>
                                            <div className="d-flex">
                                                <FaEdit
                                                    className="me-3 text-gray-800"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click
                                                        handleEdit(customer.customer_id); // Navigate to EditCustomer page
                                                    }}
                                                />
                                                <FaTrashAlt
                                                    className="text-gray-800"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent row click
                                                        handleDelete(customer.customer_id);
                                                    }}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        {/* Pagination */}
                        {filteredCustomers.length > itemsPerPage && ( 
                            <Pagination className="custom-pagination justify-content-center">
                            <Pagination.First 
                                onClick={() => paginate(1)} 
                                disabled={currentPage === 1}
                            >
                                « First
                            </Pagination.First>
                            <Pagination.Prev 
                                onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} 
                                disabled={currentPage === 1}
                            >
                                ‹ Previous
                            </Pagination.Prev>
                            <Pagination.Next 
                                onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : currentPage)} 
                                disabled={currentPage === totalPages}
                            >
                                Next ›
                            </Pagination.Next>
                            <Pagination.Last 
                                onClick={() => paginate(totalPages)} 
                                disabled={currentPage === totalPages}
                            >
                                Last »
                            </Pagination.Last>
                        </Pagination>
                        )}
                    </div>
                </section>
            )}

            {/* ToastContainer */}
            <ToastContainer />
        </div>
    );
};

export default CustomersList;
