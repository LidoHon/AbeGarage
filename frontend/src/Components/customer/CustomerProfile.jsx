import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import customerService from "../../Components/services/customer.service";
import { Button, Row, Col, Card, Modal, Form } from "react-bootstrap";
import AddVehicleForm from "../../Components/Admin/AddVehicleForm/AddVehicleForm";
const api_url = import.meta.env.VITE_API_URL;
import { FcFullTrash } from "react-icons/fc";
import { FaEdit } from "react-icons/fa";
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

  /*************  ✨ Codeium Command ⭐  *************/
  /**
   * Handles updating a vehicle when the user submits the edit form.
   *
   * Sends a PUT request to the API with the updated vehicle data.
   * If the request is successful, updates the vehicle list with the new data
   * and closes the edit modal.
   * If the request fails, logs an error message to the console.
   *
   * @function
   */
  /******  dfd45ce8-0566-44b5-afb7-15d12aee2758  *******/
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
  const handleEdit = (customerData) => {
    setSelectedCustomer(customerData);
    setShowEditModal(true);
  };

  return (
    <div className="container mt-4">
      <Row>
        <Col md={3}>
          <div className="d-flex flex-column align-items-center position-relative">
            <div
              style={{
                position: "absolute",
                top: "50px",
                bottom: "50px",
                width: "2px",
                backgroundColor: "#e0e0e0",
                zIndex: 0,
              }}
            ></div>

            <Button
              variant="danger"
              className="rounded-circle mb-24"
              style={{
                width: "100px",
                height: "100px",
                position: "relative",
                zIndex: 1,
              }}
            >
              Info
            </Button>
            <Button
              variant="danger"
              className="rounded-circle mb-24"
              style={{
                width: "100px",
                height: "100px",
                position: "relative",
                zIndex: 1,
              }}
            >
              Cars
            </Button>
            <Button
              variant="danger"
              className="rounded-circle"
              style={{
                width: "100px",
                height: "100px",
                position: "relative",
                zIndex: 1,
              }}
            >
              Orders
            </Button>
          </div>
        </Col>
        <Col md={9}>
          <div className="my-6">
            <h3 className="text-2xl font-bold text-blue-800">
              Customer: {customerData.customer_first_name}{" "}
              {customerData.customer_last_name}
            </h3>
            <p></p>
            <strong>Email:</strong>{" "}
            <span className="text-gray-400">{customerData.customer_email}</span>
            <p>
              <strong>Phone Number:</strong>
              <span className="text-gray-400">
                {" "}
                {customerData.customer_phone}
              </span>
            </p>
            <p>
              <strong>Active Customer:</strong>{" "}
              <span className="text-gray-400">
                {customerData.active_customer ? "Yes" : "No"}
              </span>
            </p>
            <p className="flex items-center gap-6">
              <strong>Edit Customer info:</strong>{" "}
              <FaEdit
                className="me-3 text-green-600"
                style={{ cursor: "pointer" }}
                onClick={() => handleEdit(customerData)}
              />
            </p>
            {/* <Button
                variant="link"
                href={/admin/edit-customer/${customer_id}}
              >
                <i className="fa fa-edit"></i> Edit customer info
              </Button> */}
          </div>

          <div>
            <h3 className="text-2xl font-bold text-blue-800">
              Vehicles of {customerData.customer_first_name}
            </h3>

            {vehicles.length > 0 ? (
              <div className="d-flex flex-wrap gap-3">
                {vehicles.map((vehicle) => (
                  <div
                    key={vehicle.vehicle_id}
                    className="card shadow p-3 my-2 bg-white rounded"
                    style={{ width: "18rem" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">
                        {vehicle.vehicle_make} {vehicle.vehicle_model}
                      </h5>
                      <p className="card-text">
                        <strong>Vehicle color:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_color}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle tag:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_tag}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle year:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_year}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle mileage:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_mileage}
                        </span>
                      </p>
                      <p className="card-text">
                        <strong>Vehicle serial:</strong>{" "}
                        <span className="text-gray-400">
                          {vehicle.vehicle_serial}
                        </span>
                      </p>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="link"
                          onClick={() => handleEditVehicleClick(vehicle)}
                        >
                          <i className="fa fa-edit"></i> Edit
                        </Button>
                        <Button
                          className="bg-inherit border-0"
                          onClick={() =>
                            handleDeleteVehicle(vehicle.vehicle_id)
                          }
                        >
                          <FcFullTrash />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p>No vehicles found</p>
            )}

            {!showAddVehicleForm && (
              <Button variant="danger" onClick={handleAddVehicleClick}>
                Add New Vehicle
              </Button>
            )}
          </div>

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
          {/* orders */}
          <div className="my-6">
            <h3 className="text-2xl font-bold text-blue-800">
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
          </div>
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
