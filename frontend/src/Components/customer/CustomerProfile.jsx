import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import customerService from "../../Components/services/customer.service";
import { Button, Row, Col, Card } from "react-bootstrap";
import AddVehicleForm from "../../Components/Admin/AddVehicleForm/AddVehicleForm";

const CustomerProfile = () => {
  const { customer_id } = useParams();

  const [customerData, setCustomerData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await customerService.getCustomer(customer_id);
        const data = await res.json();
        console.log("Customer data response:", data);
        setCustomerData(data.data);
      } catch (error) {
        console.error("Error fetching customer data", error);
      }
    };

    fetchCustomerData();
  }, [customer_id]);

  useEffect(() => {
    const fetchCustomerVehicles = async () => {
      try {
        const res = await customerService.getCustomerVehicles(customer_id);
        const data = await res.json();
        console.log("Vehicles data response:", data);
        if (data.status === "success") {
          setVehicles(data.data);
        } else {
          setVehicles([]);
        }
      } catch (error) {
        console.error("Error fetching customer vehicles", error);
      }
    };

    fetchCustomerVehicles();
  }, [customer_id]);

  const handleAddVehicleClick = () => {
    setShowAddVehicleForm(true);
  };

  const handleVehicleAdded = (newVehicle) => {
    setVehicles((prevVehicles) => [...prevVehicles, newVehicle]);
    setShowAddVehicleForm(false);
  };

  const handleDeleteVehicle = async (vehicleId) => {
    console.log("Deleting vehicle with ID:", vehicleId);
    try {
      const res = await fetch(`/api/vehicles/${vehicleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("Vehicle deleted successfully");
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.id !== vehicleId)
        );
      } else {
        console.error("Failed to delete vehicle");
      }
    } catch (error) {
      console.error("Error deleting vehicle", error);
    }
  };

  if (!customerData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Row>
        <Col md={3}>
          <div className="d-flex flex-column align-items-center">
            <Button
              variant="danger"
              className="rounded-circle mb-3"
              style={{ width: "100px", height: "100px" }}
            >
              Info
            </Button>
            <Button
              variant="danger"
              className="rounded-circle mb-3"
              style={{ width: "100px", height: "100px" }}
            >
              Cars
            </Button>
            <Button
              variant="danger"
              className="rounded-circle mb-3"
              style={{ width: "100px", height: "100px" }}
            >
              Orders
            </Button>
          </div>
        </Col>
        <Col md={9}>
          <Card className="mb-4">
            <Card.Body>
              <h3>
                Customer: {customerData.customer_first_name}{" "}
                {customerData.customer_last_name}
              </h3>
              <p>
                <strong>Email:</strong> {customerData.customer_email}
              </p>
              <p>
                <strong>Phone Number:</strong> {customerData.customer_phone}
              </p>
              <p>
                <strong>Active Customer:</strong>{" "}
                {customerData.active_customer ? "Yes" : "No"}
              </p>
              <Button
                variant="link"
                href={`/admin/edit-customer/${customer_id}`}
              >
                <i className="fa fa-edit"></i> Edit customer info
              </Button>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <h3>Vehicles of {customerData.customer_first_name}</h3>
              {vehicles.length > 0 ? (
                <ul>
                  {vehicles.map((vehicle) => (
                    <li key={vehicle.id}>
                      <strong>
                        {vehicle.vehicle_make} {vehicle.vehicle_model}
                      </strong>
                      <p>Vehicle color: {vehicle.vehicle_color}</p>
                      <p>Vehicle tag: {vehicle.vehicle_tag}</p>
                      <p>Vehicle year: {vehicle.vehicle_year}</p>
                      <p>Vehicle mileage: {vehicle.vehicle_mileage}</p>
                      <p>Vehicle serial: {vehicle.vehicle_serial}</p>
                      <Button
                        variant="link"
                        href={`/admin/edit-vehicle/${vehicle.id}`}
                      >
                        <i className="fa fa-edit"></i> Edit vehicle info
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                      >
                        Delete
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No vehicles found</p>
              )}
              {!showAddVehicleForm && (
                <Button variant="danger" onClick={handleAddVehicleClick}>
                  Add New Vehicle
                </Button>
              )}
            </Card.Body>
          </Card>

          {showAddVehicleForm && (
            <Card className="mb-4">
              <Card.Body>
                <AddVehicleForm
                  customer_id={customer_id}
                  onVehicleAdded={handleVehicleAdded}
                />
              </Card.Body>
            </Card>
          )}

          <Card>
            <Card.Body>
              <h3>Orders of {customerData.customer_first_name}</h3>
              {orders.length > 0 ? (
                <ul>
                  {orders.map((order) => (
                    <li key={order.id}>
                      Order #{order.id} - {order.status}
                    </li>
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
