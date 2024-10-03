import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Button, Pagination } from "react-bootstrap"; 
import Service from "../../services/order.service";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1); 
    const itemsPerPage = 4; 
    const navigate = useNavigate();

    const statusMapping = {
        1: "Received",
        2: "In Progress",
        3: "Completed",
    };

useEffect(() => {
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await Service.getAllOrders();
            if (response.data && response.data.orders) {
            setOrders(response.data.orders.reverse());
            } else {
            setOrders([]);
            }
        } catch (err) {
            setError("Error fetching orders. Please try again.");
        } finally {
            setLoading(false);
        }
        };

        fetchOrders();
    }, []);

    const handleDelete = async (orderId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete the order with ID: ${orderId}?`);
        if (confirmDelete) {
        try {
            await Service.deleteOrder(orderId);
            setOrders((prevOrders) => prevOrders.filter((order) => order.order_id !== orderId));
            alert("Order deleted successfully.");
        } catch (err) {
            setError("Error deleting the order. Please try again.");
        }
        }
    };

    const handleView = (orderId) => {
        navigate(`/admin/order/${orderId}`);
    };

    const handleEditOrder = (order) => {
        const orderData = {
        ...order,
        services: order.selected_services,
        additionalRequest: order.additional_request,
        orderPrice: order.order_total_price,
        estimatedCompletionDate: order.estimated_completion_date
        };

        navigate(`/admin/edit-order/${order.order_id}`, {
        state: { orderData },
        });
    };

    // Pagination Logic
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const totalPages = Math.ceil(orders.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div className="container my-4 px-10 text-sm">
            <div className="flex items-center gap-4">
                <h2 className="page-titles text-3xl font-bold mb-4 mt-4">Orders</h2>
                <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
            </div>
        <Table striped bordered hover responsive>
            <thead>
            <tr>
                <th>Order Id</th>
                <th>Customer</th>
                <th>Vehicle</th>
                <th>Order Date</th>
                <th>Received by</th>
                <th>Order Status</th>
                <th>View/Edit/Delete</th>
            </tr>
            </thead>
            <tbody>
            {currentOrders.length > 0 ? (
                currentOrders.map((order) => (
                <tr key={order.order_id}>
                    <td>{order.order_id}</td>
                    <td>
                    <strong>{order.customer_first_name} {order.customer_last_name}</strong>
                    <br />
                    {order.customer_email}
                    <br />
                    {order.customer_phone}
                    </td>
                    <td>
                    <strong>{order.vehicle_make} {order.vehicle_model}</strong>
                    <br />
                    {order.vehicle_year}
                    <br />
                    {order.vehicle_tag}
                    </td>
                    <td>{new Date(order.order_date).toLocaleDateString()}</td>
                    <td>{order.employee_first_name} {order.employee_last_name}</td>
                    <td>
                    <span className={`badge ${order.order_status === 3 ? "bg-success" : order.order_status === 2 ? "bg-warning text-dark" : "bg-secondary"}`}>
                        {statusMapping[order.order_status] || "Unknown"}
                    </span>
                    </td>
                    <td>
                        <button className="btn btn-sm" onClick={() => handleView(order.order_id)}>
                            <i className="fas fa-external-link-alt"></i>
                        </button>
                        <button className="btn btn-sm "onClick={() => handleEditOrder(order)}>
                            <i className="fas fa-pen"></i>
                        </button>
                        <button className="btn btn-sm" onClick={() => handleDelete(order.order_id)}>
                            <i className="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan="7" className="text-center">No orders found.</td>
                </tr>
            )}
            </tbody>
        </Table>

        {/* Pagination */}
        {orders.length > itemsPerPage && (
            <Pagination className="custom-pagination justify-content-center">
            <Pagination.First onClick={() => paginate(1)} disabled={currentPage === 1}>
                « First
            </Pagination.First>
            <Pagination.Prev onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)} disabled={currentPage === 1}>
                ‹ Previous
            </Pagination.Prev>
            <Pagination.Next onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : currentPage)} disabled={currentPage === totalPages}>
                Next ›
            </Pagination.Next>
            <Pagination.Last onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
                Last »
            </Pagination.Last>
            </Pagination>
        )}
        </div>
    );
};

export default OrderList;
