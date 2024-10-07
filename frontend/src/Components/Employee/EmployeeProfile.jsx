import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import employeeService from "../../Components/services/employee.service";
import { useAuth } from "../../Contexts/AuthContext";
import { Spinner, Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { FaEllipsisV } from "react-icons/fa"; 

const EmployeeProfile = () => {
  const { employee_id: paramEmployeeId } = useParams(); 
  const { isLogged, isAdmin, isEmployee, employee: authEmployee } = useAuth(); 
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("employee_token");
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isEditingStatus, setIsEditingStatus] = useState({});

  const employee_id = paramEmployeeId || (isEmployee ? authEmployee.employee_id : null);

  // Fetch employee details using getEmployeeById instead of getEmployeesByRole
  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const response = await employeeService.getEmployeeById(employee_id, token); // Fetch employee by ID
        const employeeData = await response.json();
        
        if (employeeData.status !== "success" || !employeeData.data) {
          setError("Employee not found.");
          return;
        }

        setEmployee(employeeData.data); // Set employee data
      } catch (err) {
        console.error("Error occurred fetching employee details:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false); // Stop loading after fetching
      }
    };

    const fetchAssignedTasks = async () => {
      try {
        const tasksResponse = await employeeService.getEmployeeTasks(employee_id, token);
        console.log("task response for emp profile", tasksResponse)
        setTasks(tasksResponse); 
      } catch (err) {
        console.error("An error occurred fetching tasks:", err);
        setError("Failed to load assigned tasks.");
      }
    };

    if (employee_id) {
      fetchEmployeeDetails();  // Fetch employee details
      fetchAssignedTasks();    // Fetch employee tasks
    } else {
      setError("No employee ID found.");
      setLoading(false);
    }
  }, [employee_id, token, isEmployee]);

  const handleStatusChange = (orderServiceId, newStatus) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [orderServiceId]: newStatus, 
    }));
    setIsEditingStatus((prev) => ({
      ...prev,
      [orderServiceId]: true, 
    }));
  };

  const handleSaveStatus = async (orderServiceId) => {
    const updatedStatus = selectedStatus[orderServiceId];
  
    try {
      const response = await employeeService.updateTaskStatus(orderServiceId, updatedStatus, token);
  
      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.order_service_id === orderServiceId
              ? { ...task, order_status: updatedStatus }
              : task
          )
        );
        setIsEditingStatus((prev) => ({
          ...prev,
          [orderServiceId]: false,
        }));
      } else {
        console.error(`[Frontend] Failed to update status for Order Service ID: ${orderServiceId}`, response.statusText);
      }
    } catch (err) {
      console.error(`[Frontend] Failed to update status for Order Service ID: ${orderServiceId}`, err);
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

  const orders = tasks.reduce((acc, task) => {
    const { order_id } = task;

    if (!acc[order_id]) {
      acc[order_id] = {
        customer: {
          customer_first_name: task.customer_first_name,
          customer_last_name: task.customer_last_name,
          customer_email: task.customer_email,
          customer_phone: task.customer_phone,
        },
        vehicle: {
          vehicle_make: task.vehicle_make,
          vehicle_model: task.vehicle_model,
          vehicle_year: task.vehicle_year,
          vehicle_mileage: task.vehicle_mileage,
          vehicle_tag: task.vehicle_tag,
        },
        services: [],
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
          </Card>
        </Col>
      </Row>
      <h2>Your Tasks</h2>
      <Row>
        {Object.keys(orders)
          .sort((a, b) => b - a) 
          .map(order_id => (
            <Col key={order_id} md={12} className="mb-4">
              <Card className="shadow-sm w-100">
                <Card.Body>
                  <h5 className="text-uppercase mb-3">Order ID: #{order_id}</h5> 
                  <div className="text-sm flex gap-20">
                    <div>
                      <h6 className="text-uppercase">Customer</h6>
                      <p><strong>{orders[order_id].customer.customer_first_name} {orders[order_id].customer.customer_last_name}</strong></p>
                      <p><strong>Email:</strong> {orders[order_id].customer.customer_email}</p>
                      <p><strong>Phone:</strong> {orders[order_id].customer.customer_phone}</p>
                    </div>
                    <div className="mr-8">
                      <h6 className="text-uppercase">Vehicle</h6>
                      <p><strong>{orders[order_id].vehicle.vehicle_make} {orders[order_id].vehicle.vehicle_model}</strong></p>
                      <p><strong>Year:</strong> {orders[order_id].vehicle.vehicle_year}</p>
                      <p><strong>Mileage:</strong> {orders[order_id].vehicle.vehicle_mileage}</p>
                      <p><strong>Tag:</strong> {orders[order_id].vehicle.vehicle_tag}</p>
                    </div>
                  </div>
                  <h5 className="mt-3">Requested Services</h5>
                  {orders[order_id].services.map((service) => (
                    <Card key={`${order_id}-${service.order_service_id}`} className="mb-2 shadow-sm">
                      <Card.Body className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="mb-0">{service.service_name}</h6>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="me-1">{getStatusBadge(service.order_status)}</span>
                          {isLogged && isEmployee && service.order_status !== 3 && (
                            <>
                              {!isEditingStatus[service.order_service_id] ? (
                                <div
                                  className="d-inline-flex align-items-center"
                                  onClick={() => setIsEditingStatus((prev) => ({ ...prev, [service.order_service_id]: true }))}>
                                  <FaEllipsisV />
                                </div>
                              ) : (
                                <>
                                  <Form.Select
                                    value={selectedStatus[service.order_service_id] || service.order_status}
                                    onChange={(e) => handleStatusChange(service.order_service_id, e.target.value)}
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
                                    onClick={() => handleSaveStatus(service.order_service_id)}
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
                </Card.Body>
              </Card>
            </Col>
          ))}
      </Row>
    </Container>
  );
};

export default EmployeeProfile;
