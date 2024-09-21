import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../services/order.service";

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
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
                const response = await Service.getOrders();
                console.log("Full API Response:", response.data);

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

    // Navigate to the EditOrderForm with the order data passed via state
    const handleEditOrder = (order) => {
        // Extract necessary fields from the order object
        const orderData = {
            ...order,
            services: order.selected_services,  
            additionalRequest: order.additional_request,
            orderPrice: order.order_total_price,
            estimatedCompletionDate: order.estimated_completion_date
        };

        navigate(`/admin/edit-order/${order.order_id}`, {
            state: {
                orderData,  
            },
        });
    };

    if (loading) {
        return <p>Loading orders...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    return (
        <div className="container my-4 mr-2">
            <h2 className="mb-4">Orders</h2>
            <table className="table table-hover">
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
                    {orders.length > 0 ? (
                        orders.map((order) => (
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
                                    <button
                                        className="btn btn-sm btn-secondary me-2"
                                        onClick={() => handleEditOrder(order)}
                                    >
                                        <i className="fas fa-pen"></i> 
                                    </button>
                                    <button className="btn btn-sm btn-primary me-2" onClick={() => handleView(order.order_id)}>
                                        <i className="fas fa-external-link-alt"></i> 
                                    </button>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(order.order_id)}>
                                        <i className="fas fa-trash"></i> 
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center">
                                No orders found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
