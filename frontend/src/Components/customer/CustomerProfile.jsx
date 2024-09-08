import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import customerService from "../../Components/services/customer.service"; 
import { Button, Row, Col, Card } from 'react-bootstrap';
import AddVehicleForm from '../../Components/Admin/AddVehicleForm/AddVehicleForm'; 

const CustomerProfile = () => {
    // Get customer ID from the URL
    const { customer_id } = useParams(); 
    
    const [customerData, setCustomerData] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [orders, setOrders] = useState([]);
    // Toggle vehicle form
    const [showAddVehicleForm, setShowAddVehicleForm] = useState(false); 

    useEffect(() => {
        // Fetch customer data
        const fetchCustomerData = async () => {
            try {
                const res = await customerService.getCustomer(customer_id);
                const data = await res.json();
                console.log("API response:", data);
                setCustomerData(data.data);
                setVehicles(data.vehicles || []); 
                setOrders(data.orders || []);     
            } catch (error) {
                console.error('Error fetching customer data', error);
            }
        };

        fetchCustomerData();
    }, [customer_id]);

    const handleAddVehicleClick = () => {
        setShowAddVehicleForm(true);
    };

    const handleVehicleAdded = (newVehicle) => {
        // Add the new vehicle to the list
        setVehicles([...vehicles, newVehicle]); 
        // Hide the form after submission
        setShowAddVehicleForm(false); 
    };

    if (!customerData) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-4">
            <Row>
                <Col md={3}>
                    {/* Sidebar for navigation */}
                    <div className="d-flex flex-column align-items-center">
                        <Button variant="danger" className="rounded-circle mb-3" style={{ width: '100px', height: '100px' }}>
                            Info
                        </Button>
                        <Button variant="danger" className="rounded-circle mb-3" style={{ width: '100px', height: '100px' }}>
                            Cars
                        </Button>
                        <Button variant="danger" className="rounded-circle mb-3" style={{ width: '100px', height: '100px' }}>
                            Orders
                        </Button>
                    </div>
                </Col>
                <Col md={9}>
                    {/* Customer Info */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h3>Customer: {customerData.customer_first_name} {customerData.customer_last_name}</h3>
                            <p><strong>Email:</strong> {customerData.customer_email}</p>
                            <p><strong>Phone Number:</strong> {customerData.customer_phone}</p>
                            <p><strong>Active Customer:</strong> {customerData.active_customer ? "Yes" : "No"}</p>
                            <Button variant="link" href={`/admin/edit-customer/${customer_id}`}>
                                <i className="fa fa-edit"></i> Edit customer info
                            </Button>
                        </Card.Body>
                    </Card>

                    {/* Vehicles Section */}
                    <Card className="mb-4">
                        <Card.Body>
                            <h3>Vehicles of {customerData.customer_first_name}</h3>
                            {vehicles.length > 0 ? (
                                <ul>
                                    {vehicles.map(vehicle => (
                                        <li key={vehicle.id}>
                                            <strong>{vehicle.make} {vehicle.model}</strong>
                                            <p>Vehicle color: {vehicle.color}</p>
                                            <p>Vehicle tag: {vehicle.tag}</p>
                                            <p>Vehicle year: {vehicle.year}</p>
                                            <p>Vehicle mileage: {vehicle.mileage}</p>
                                            <p>Vehicle serial: {vehicle.serial}</p>
                                            <Button variant="link" href={`/admin/edit-vehicle/${vehicle.id}`}>
                                                <i className="fa fa-edit"></i> Edit vehicle info
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No vehicle found</p>
                            )}
                            {!showAddVehicleForm && (
                                <Button variant="danger" onClick={handleAddVehicleClick}>Add New Vehicle</Button>
                            )}
                        </Card.Body>
                    </Card>

                    {showAddVehicleForm && (
                        <Card className="mb-4">
                            <Card.Body>
                                <AddVehicleForm customer_id={customerData.customer_id} onVehicleAdded={handleVehicleAdded} />
                            </Card.Body>
                        </Card>
                    )}

                    {/* Orders Section */}
                    <Card>
                        <Card.Body>
                            <h3>Orders of {customerData.customer_first_name}</h3>
                            {orders.length > 0 ? (
                                <ul>
                                    {orders.map(order => (
                                        <li key={order.id}>Order #{order.id} - {order.status}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Orders will be displayed here</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default CustomerProfile;
