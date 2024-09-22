import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import employeeService from "../../Components/services/employee.service";
import Service from "../../Components/services/order.service";
import { useAuth } from "../../Contexts/AuthContext";
import { Spinner, Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaEllipsisV} from "react-icons/fa"; 

const EmployeeProfile = () => {
  const { employee_id } = useParams();
  const { isLogged, isAdmin, isEmployee } = useAuth(); 
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("employee_token");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isEditingStatus, setIsEditingStatus] = useState({});

  useEffect(() => {
    console.log("isEmployee:", isEmployee);
    console.log("isAdmin:", isAdmin);
    console.log("isLogged:", isLogged);

    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const employees = await Service.getEmployeesByRole(1);
        const employee = employees.find(emp => emp.employee_id === parseInt(employee_id));

        if (!employee) {
          setError("Employee not found.");
          return;
        }

        setEmployee(employee);
      } catch (err) {
        console.error("Error occurred fetching employee details:", err);
        setError("An error occurred. Please try again.");
      }
    };

    const fetchAssignedTasks = async () => {
      try {
        const tasksResponse = await employeeService.getEmployeeTasks(employee_id, token);
        console.log("Employee Token:", token);
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          setTasks(tasksData.tasks);
        } else {
          const errorMsg = await tasksResponse.text();
          setError("Failed to load assigned tasks.");
        }
      } catch (err) {
        setError("An error occurred fetching tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
    fetchAssignedTasks();
  }, [employee_id, token, isEmployee]);

  const handleStatusChange = (orderServiceId, newStatus) => {
    // Ensure the status is mapped to an integer
    const statusMap = {
      "Received": 1,
      "In progress": 2,
      "Completed": 3
    };
  
    const mappedStatus = statusMap[newStatus] || newStatus; // Ensure newStatus is properly mapped
  
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [orderServiceId]: parseInt(mappedStatus), 
    }));
    setIsEditingStatus((prev) => ({
      ...prev,
      [orderServiceId]: true,
    }));
  };
  
  const handleSaveStatus = async (orderServiceId) => {
    const updatedStatus = selectedStatus[orderServiceId];
  
    try {
      console.log(`[Frontend] Saving status for OrderService ID: ${orderServiceId} with status: ${updatedStatus}`);
      // Call the backend service to update the status of the task
      const response = await employeeService.updateTaskStatus(orderServiceId, updatedStatus, token);
  
      if (response.ok) {
        console.log(`Order Service ID: ${orderServiceId} successfully updated to status ${updatedStatus}`);
        setIsEditingStatus((prev) => ({
          ...prev,
          [orderServiceId]: false,
        }));
      } else {
        console.error(`Failed to update status for Order Service ID: ${orderServiceId}`, response.statusText);
      }
    } catch (err) {
      console.error(`Failed to update status for Order Service ID: ${orderServiceId}`, err);
    }
  };
  

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge bg-secondary">Received</span>;
      case 2:
        return <span className="badge bg-warning text-dark">In progress</span>;
      case 3:
        return <span className="badge bg-success">Completed</span>;
      default:
        return <span className="badge bg-dark">Unknown</span>;
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <h3 className="text-danger">{error}</h3>
      </Container>
    );
  }

  if (!employee) {
    return (
      <Container className="mt-5">
        <h3 className="text-warning">Employee not found.</h3>
      </Container>
    );
  }

  // Group tasks by order
  const orders = tasks.reduce((acc, task) => {
    const {
      order_id,
      customer_first_name,
      customer_last_name,
      customer_email,
      customer_phone,
      vehicle_make,
      vehicle_model,
      vehicle_year,
      vehicle_mileage,
      vehicle_tag,
      estimated_completion_date,
    } = task;

    if (!acc[order_id]) {
      acc[order_id] = {
        customer: { customer_first_name, customer_last_name, customer_email, customer_phone },
        vehicle: { vehicle_make, vehicle_model, vehicle_year, vehicle_mileage, vehicle_tag },
        services: [],
        estimated_completion_date,
      };
    }

    acc[order_id].services.push(task);

    return acc;
  }, {});

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col md={12}>
          <Card className="shadow">
            <Card.Body>
              <h5>Employee</h5>
              <p><strong>{employee.employee_first_name} {employee.employee_last_name}</strong></p>
              <p><strong>Email:</strong> {employee.employee_email}</p>
              <p><strong>Phone:</strong> {employee.employee_phone}</p>
              <p><strong>Active Employee:</strong> {employee.active_employee ? "Yes" : "No"}</p>
              <p><strong>Added Date:</strong> {new Date(employee.added_date).toLocaleString()}</p>
            </Card.Body>
            <div className="border-bottom border-danger"></div>
          </Card>
        </Col>
      </Row>

      {Object.keys(orders).map(order_id => (
        <Card key={order_id} className="mt-4 shadow-sm">
          <Card.Body>
            <Row>
              <Col md={6}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body>
                    <h6 className="text-uppercase">Customer</h6>
                    <p><strong>{orders[order_id].customer.customer_first_name} {orders[order_id].customer.customer_last_name}</strong></p>
                    <p><strong>Email:</strong> {orders[order_id].customer.customer_email}</p>
                    <p><strong>Phone:</strong> {orders[order_id].customer.customer_phone}</p>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="mb-3 shadow-sm">
                  <Card.Body>
                    <h6 className="text-uppercase">Vehicle</h6>
                    <p><strong>{orders[order_id].vehicle.vehicle_make} {orders[order_id].vehicle.vehicle_model}</strong></p>
                    <p><strong>Year:</strong> {orders[order_id].vehicle.vehicle_year}</p>
                    <p><strong>Mileage:</strong> {orders[order_id].vehicle.vehicle_mileage}</p>
                    <p><strong>Tag:</strong> {orders[order_id].vehicle.vehicle_tag}</p>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <h5 className="mt-3">Requested Services</h5>
                {orders[order_id].services.map((service) => (
                  <Card key={service.order_service_id} className="mb-2 shadow-sm">  {/* Use order_service_id */}
                    <Card.Body className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6 className="mb-0">{service.service_name}</h6>
                      </div>
                      <div className="d-flex align-items-center">
                        {isLogged && isEmployee && service.order_status !== 3 && (
                          <>
                            {!isEditingStatus[service.order_service_id] ? (  // Use order_service_id
                              <div
                                className="d-inline-flex align-items-center"
                                onClick={() => setIsEditingStatus((prev) => ({ ...prev, [service.order_service_id]: true }))}  // Use order_service_id
                              >
                                <span className="me-1">
                                  {getStatusBadge(service.order_status)}
                                </span>
                                <FaEllipsisV />
                              </div>
                            ) : (
                              <>
                                <Form.Select
                                  value={selectedStatus[service.order_service_id] || service.order_status}  // Use order_service_id
                                  onChange={(e) => handleStatusChange(service.order_service_id, e.target.value)}  // Use order_service_id
                                  className="form-select-sm ms-2"
                                >
                                  <option value={1}>Received</option>
                                  <option value={2}>In progress</option>
                                  <option value={3}>Completed</option>
                                </Form.Select>
                                <Button
                                  variant="success"
                                  size="sm"
                                  className="ms-2"
                                  onClick={() => handleSaveStatus(service.order_service_id)}  // Use order_service_id
                                >
                                  Save
                                </Button>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </Col>
            </Row>

            <Row>
              <Col>
                <p><strong>Due Date:</strong> {orders[order_id].estimated_completion_date ? new Date(orders[order_id].estimated_completion_date).toLocaleDateString() : "Not set"}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default EmployeeProfile;
