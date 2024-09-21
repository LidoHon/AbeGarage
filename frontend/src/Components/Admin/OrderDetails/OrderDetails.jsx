import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Service from "../../services/order.service";

const OrderDetails = () => {
    const { orderId } = useParams(); 
    console.log("Order ID from useParams:", orderId);

    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                setLoading(true);
                const response = await Service.getOrderDetails(orderId);
                console.log("Order Details Response:", response);
                
                if (response && response.data) {
                    setOrderDetails(response.data);
                } else {
                    setError("No order details found.");
                }
            } catch (err) {
                setError("Error fetching order details. Please try again.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrderDetails();
    }, [orderId]);

    if (loading) {
        return <p>Loading order details...</p>;
    }

    if (error) {
        return <p className="text-danger">{error}</p>;
    }

    if (!orderDetails) {
        return <p>No order details found.</p>;
    }

    // Extract the vehicle mileage and services from the order details
    const services = orderDetails.services || []; // Extract services
    const vehicleMileage = orderDetails.vehicle_mileage || 'N/A'; // Extract vehicle mileage

    return (
        <div className="container mt-5">
            <div className="row mb-4">
                <div className="col d-flex justify-content-between align-items-center">
                    <h2 className="text-primary">
                        {orderDetails.customer_first_name} {orderDetails.customer_last_name}
                    </h2>
                    <span className="badge bg-warning text-dark fs-5">In progress</span>
                </div>
            </div>

            <p className="text-muted mb-4">
                You can track the progress of your order using this page. We will constantly update this page to let you know how we are progressing. As soon as we are done with the order, the status will turn green. That means, your car is ready for pickup.
            </p>

            <div className="row">
                {/* Customer Information */}
                <div className="col-md-6">
                    <div className="card mb-4 p-3">
                        <h5>Customer</h5>
                        <hr />
                        <p><strong>{orderDetails.customer_first_name} {orderDetails.customer_last_name}</strong></p>
                        <p>Email: {orderDetails.customer_email}</p>
                        <p>Phone Number: {orderDetails.customer_phone}</p>
                        <p>Active Customer: <span className={orderDetails.active_customer ? "text-success" : "text-danger"}>{orderDetails.active_customer ? "Yes" : "No"}</span></p>
                    </div>
                </div>

                {/* Car Information */}
                <div className="col-md-6">
                    <div className="card mb-4 p-3">
                        <h5>Car in Service</h5>
                        <hr />
                        <p><strong>{orderDetails.vehicle_make} {orderDetails.vehicle_model}</strong></p>
                        <p>Vehicle tag: {orderDetails.vehicle_tag}</p>
                        <p>Vehicle year: {orderDetails.vehicle_year}</p>
                        <p>Vehicle mileage: {vehicleMileage}</p>
                    </div>
                </div>
            </div>

            {/* Requested Services */}
            <div className="card p-3 mb-4">
                <h5 className="mb-3">Requested Services</h5>
                {services.length > 0 ? (
                    services.map((service, index) => (
                        <div key={index} className="d-flex justify-content-between align-items-center border-bottom pb-3 mb-3">
                            <div>
                                <h6>{service.service_name}</h6>
                                <p className="text-muted">{service.service_description}</p>
                            </div>
                            <span className="badge bg-warning text-dark">In progress</span>
                        </div>
                    ))
                ) : (
                    <p>No services requested.</p>
                )}

                {/* Additional Request */}
                {orderDetails.additional_request && (
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h6>Additional request</h6>
                            <p className="text-muted">{orderDetails.additional_request}</p>
                        </div>
                        <span className="badge bg-warning text-dark">In progress</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderDetails;
