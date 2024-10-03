import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import customerService from "../../Components/services/customer.service";
import { Button, Row, Col, Card, Modal, Form } from "react-bootstrap";
import AddVehicleForm from "../../Components/Admin/AddVehicleForm/AddVehicleForm";
const api_url = import.meta.env.VITE_API_URL;
import { FcFullTrash } from "react-icons/fc";
const CustomerProfile = () => {
  const { customer_id } = useParams();

  const [customerData, setCustomerData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showAddVehicleForm, setShowAddVehicleForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const [formData, setFormData] = useState({
    vehicle_make: "",
    vehicle_model: "",
    vehicle_year: "",
    vehicle_color: "",
    vehicle_tag: "",
    vehicle_mileage: "",
    vehicle_serial: "",
  });

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

  useEffect(() => {
    const fetchCustomerOrders = async () => {
      try {
        const res = await customerService.getCustomerOrders(customer_id); 
        const data = await res.json();
        console.log("Orders data response:", data);
        if (data.status === "success") {
          setOrders(data.data);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching customer orders", error);
      }
    };

    fetchCustomerOrders();
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
      const res = await fetch(`${api_url}/api/vehicles/${vehicleId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        console.log("Vehicle deleted successfully");
        setVehicles((prevVehicles) =>
          prevVehicles.filter((vehicle) => vehicle.vehicle_id !== vehicleId)
        );
      }
    } catch (error) {
      console.error("Error deleting vehicle", error);
    }
  };

  const handleEditVehicleClick = (vehicle) => {
    setEditingVehicle(vehicle);
    setFormData(vehicle);
    setShowEditModal(true);
  };

  const handleUpdateVehicle = async () => {
    try {
      const res = await fetch(
        `${api_url}/api/vehicles/${editingVehicle.vehicle_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (res.ok) {
        console.log("Vehicle updated successfully");
        // Update the vehicle list
        setVehicles((prevVehicles) =>
          prevVehicles.map((vehicle) =>
            vehicle.vehicle_id === editingVehicle.vehicle_id
              ? formData
              : vehicle
          )
        );
        setShowEditModal(false);
      } else {
        console.error("Failed to update vehicle");
      }
    } catch (error) {
      console.error("Error updating vehicle", error);
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
              {/* <Button
                variant="link"
                href={/admin/edit-customer/${customer_id}}
              >
                <i className="fa fa-edit"></i> Edit customer info
              </Button> */}
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Body>
              <h3 className="text-xl font-bold mb-2">
                Vehicles of {customerData.customer_first_name}
              </h3>
              {vehicles.length > 0 ? (
                <ul>
                  {vehicles.map((vehicle) => (
                    <li key={vehicle.vehicle_id}>
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
                        onClick={() => handleEditVehicleClick(vehicle)}
                      >
                        <i className="fa fa-edit"></i> Edit vehicle info
                      </Button>
                      <Button
                        className="bg-inherit border-0"
                        // variant="danger"
                        onClick={() => handleDeleteVehicle(vehicle.vehicle_id)}
                      >
                        <FcFullTrash />
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
              <h3 className="text-xl font-bold mb-2">
                Orders of {customerData.customer_first_name}
              </h3>
              {orders.length > 0 ? (
                <ul>
                  {orders.map((order) => (
                    <li key={order.order_id} className="mb-2">
                      <div className="flex flex-row gap-4 ">
                        <p className="text-lg font-bold mt-1">
                          Order #{order.order_id}{" "}
                        </p>
                        <Link to={`/admin/order/${order.order_id}`}>
                          <button
                            // variant="danger"
                            className="bg-gray-700 text-white px-2  py-1 hover:bg-gray-500 hover:translate-x-2  "
                          >
                            View Order Details
                          </button>
                        </Link>
                      </div>
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

      {/* Bootstrap Modal for editing vehicle */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Vehicle Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Make</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_make}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_make: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Model</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_model}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_model: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Year</Form.Label>
              <Form.Control
                type="number"
                value={formData.vehicle_year}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_year: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Color</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_color}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_color: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Mileage</Form.Label>
              <Form.Control
                type="number"
                value={formData.vehicle_mileage}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_mileage: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Vehicle Serial</Form.Label>
              <Form.Control
                type="text"
                value={formData.vehicle_serial}
                onChange={(e) =>
                  setFormData({ ...formData, vehicle_serial: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdateVehicle}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CustomerProfile;