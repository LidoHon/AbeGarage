import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../services/order.service";
import ServiceSelection from "../AddServiceForm/SelectService";
import getAuth from "../../util/auth";
import {Table, Form} from 'react-bootstrap';

const AddOrderForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [serviceAssignments, setServiceAssignments] = useState([]);
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");

  const navigate = useNavigate();

  // Fetch customers based on the search query
  useEffect(() => {
    if (searchQuery) {
      const fetchCustomers = async () => {
        setLoading(true);
        try {
          const response = await Service.getCustomers(searchQuery);
          if (response.status === "success") {
            setCustomers(response.customers || []);
          } else {
            setCustomers([]);
          }
        } catch (err) {
          setError("Error fetching customers. Please try again.");
        } finally {
          setLoading(false);
        }
      };
      fetchCustomers();
    }
  }, [searchQuery]);

  // Fetch employees only after services have been selected
  useEffect(() => {
    if (selectedServices.length > 0) {
      const fetchEmployees = async () => {
        try {
          const response = await Service.getEmployeesByRole(1);
          setEmployees(response);
        } catch (error) {
          console.error('Error fetching employees:', error);
        }
      };
      fetchEmployees();
    }
  }, [selectedServices]);

  // Filter customers based on the search query
  useEffect(() => {
    if (searchQuery && Array.isArray(customers)) {
      const filtered = customers.filter(
        (customer) =>
          customer.customer_first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.customer_last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.customer_email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.customer_phone.includes(searchQuery)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchQuery, customers]);

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    try {
      setLoading(true);
      const vehiclesData = await Service.getVehicles(customer.customer_id);
      setVehicles(vehiclesData || []);
    } catch (err) {
      setError("Error fetching vehicles. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const handleSelectServices = (services) => {
    const updatedServiceData = services.map((serviceId) => ({
      service_id: serviceId,
      service_completed: 0,
    }));
    setSelectedServices(updatedServiceData);

    const assignments = updatedServiceData.map((service) => ({
      service_id: service.service_id,
      employee_id: null,
    }));
    setServiceAssignments(assignments);
  };

  const handleAssignEmployeeToService = (serviceId, employeeId) => {
    const updatedAssignments = serviceAssignments.map((assignment) => {
      if (assignment.service_id === serviceId) {
        return { ...assignment, employee_id: employeeId };
      }
      return assignment;
    });
    setServiceAssignments(updatedAssignments);
  };

  const allEmployeesAssigned = selectedServices.length > 0 &&
    serviceAssignments.every((assignment) => assignment.employee_id !== null);

    const handleCreateOrder = async () => {
      if (
        !selectedCustomer ||
        !selectedVehicle ||
        !orderPrice ||
        !estimatedCompletionDate ||
        !additionalRequest ||
        selectedServices.length === 0 ||
        serviceAssignments.length === 0
      ) {
        alert("Please fill in all required fields.");
        return;
      }
    
      try {
        const employee = await getAuth();
    
        if (!employee || !employee.employee_id) {
          throw new Error("Employee not found or not authenticated.");
        }
    
        // Log data for order creation
        const orderData = {
          customer_id: selectedCustomer.customer_id,
          vehicle_id: selectedVehicle.vehicle_id,
          employee_id: employee.employee_id,
          active_order: 1,
          order_hash: generateOrderHash(),
          order_status: 1,
        };
    
        const orderInfoData = {
          order_total_price: orderPrice,
          additional_request: additionalRequest,
          estimated_completion_date: estimatedCompletionDate,
          additional_requests_completed: 0,
        };
    
        
        const orderServiceData = serviceAssignments.map((assignment) => ({
          service_id: assignment.service_id,
          employee_id: assignment.employee_id,
          service_completed: 0, 
        }));
    
        // Send the order creation request to the backend
        await Service.createOrder({
          orderData,
          orderInfoData,
          orderServiceData,
        });
    
        alert("Order created successfully.");
        navigate("/admin/orders");
      } catch (err) {
        setError("Error creating the order. Please try again.");
        console.error("Error in handleCreateOrder:", err);
      }
    };
    
  

  const generateOrderHash = () => {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  };

  return (
    <div className="container pb-5">
      <div className="flex items-center gap-4 mt-4 mb-4">
        <h2 className="page-titles text-3xl font-bold mb-4 mt-4">
          Create a new order
        </h2>
        <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
      </div>
      {selectedCustomer ? (
        <div className="selected-customer-detail p-3">
          <div className="flex container justify-between bg-slate-50 py-10 px-5 border rounded-lg ">
            <div className=" ">
              <h3 className="font-bold text-2xl text-blue-900 uppercase">
                {selectedCustomer.customer_first_name}{" "}
                {selectedCustomer.customer_last_name}
              </h3>
              <p>Email: {selectedCustomer.customer_email}</p>
              <p>Phone Number: {selectedCustomer.customer_phone}</p>
            </div>
            <div className="text-right mt-0">
              <button
                className="btn btn-sm btn-danger"
                onClick={() => {
                  setSelectedCustomer(null);
                  setSelectedVehicle(null);
                  setVehicles([]);
                }}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>

          {!selectedVehicle && (
            <>
              <h4 className="mt-4">Select a Vehicle</h4>
              {vehicles.length === 0 ? (
                <>
                  <p>No vehicles found for this customer.</p>
                  <button
                    className="theme-btn btn-style-one w-56"
                    type="submit"
                  >
                    <span>Add Vehicle</span>
                  </button>
                </>
              ) : (
                <>
                  <table className="table table-bordered table-hover mt-3">
                    <thead>
                      <tr>
                        <th>Make</th>
                        <th>Model</th>
                        <th>Year</th>
                        <th>Type</th>
                        <th>Mileage</th>
                        <th>Tag</th>
                        <th>Plate</th>
                        <th>Select</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vehicles.map((vehicle) => (
                        <tr
                          key={vehicle.vehicle_id}
                          onClick={() => handleSelectVehicle(vehicle)}
                        >
                          <td>{vehicle.vehicle_make}</td>
                          <td>{vehicle.vehicle_model}</td>
                          <td>{vehicle.vehicle_year}</td>
                          <td>{vehicle.vehicle_type}</td>
                          <td>{vehicle.vehicle_mileage}</td>
                          <td>{vehicle.vehicle_tag}</td>
                          <td>{vehicle.vehicle_serial}</td>
                          <td>
                            <button
                              className={`btn btn-sm ${
                                selectedVehicle === vehicle
                                  ? "btn-success"
                                  : "btn-primary"
                              }`}
                              onClick={() => handleSelectVehicle(vehicle)}
                            >
                              {selectedVehicle === vehicle
                                ? "Selected"
                                : "Select"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="theme-btn btn-style-one w-56"
                    type="submit"
                  >
                    <span>Add Vehicle</span>
                  </button>
                </>
              )}
            </>
          )}

          {selectedVehicle && (
            <>
              <div className="flex container justify-between bg-slate-50 py-6 px-5 border rounded-lg my-4">
                <div className="selected-vehicle-details">
                  <h4 className="font-bold text-2xl text-blue-900 uppercase">
                    {selectedVehicle.vehicle_model}
                  </h4>
                  <p>Vehicle Year: {selectedVehicle.vehicle_year}</p>
                  <p>Vehicle Type: {selectedVehicle.vehicle_type}</p>
                  <p>Vehicle Mileage: {selectedVehicle.vehicle_mileage}</p>
                  <p>Tag: {selectedVehicle.vehicle_tag}</p>
                  <p>Plate: {selectedVehicle.vehicle_serial}</p>
                </div>
                <div className="text-right mt-0">
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => {
                      setSelectedCustomer(null);
                      setSelectedVehicle(null);
                      setVehicles([]);
                    }}
                  >
                    <i className="fa fa-times"></i>
                  </button>
                </div>
              </div>

              <div className="flex pb-10">
                <ServiceSelection onSelectServices={handleSelectServices} />
                <div className="ml-20">
                  <h4 className="mt-4">Assign Employees</h4>
                  <div className="form-group">
                    {selectedServices.map((service) => (
                      <div key={service.service_id} className="mt-3">
                        <h5>{`Assign Employee to ${service.service_id}`}</h5>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            handleAssignEmployeeToService(
                              service.service_id,
                              e.target.value
                            )
                          }
                        >
                          <option value="">Select an Employee</option>
                          {employees.map((emp) => (
                            <option
                              key={emp.employee_id}
                              value={emp.employee_id}
                            >
                              {`${emp.employee_first_name} ${emp.employee_last_name}`}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

                  {allEmployeesAssigned && (
                    <div>
                      <input
                        type="text"
                        className="form-control mt-3"
                        placeholder="Enter service description"
                        value={additionalRequest}
                        onChange={(e) => setAdditionalRequest(e.target.value)}
                      />
                      <input
                        type="number"
                        className="form-control mt-3"
                        placeholder="Enter price"
                        value={orderPrice}
                        onChange={(e) => setOrderPrice(e.target.value)}
                      />
                      <input
                        type="date"
                        className="form-control mt-3"
                        value={estimatedCompletionDate}
                        onChange={(e) =>
                          setEstimatedCompletionDate(e.target.value)
                        }
                      />
                      <button
                        className="btn btn-danger mt-4"
                        onClick={handleCreateOrder}
                      >
                        Submit Order
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="search-bar">
            <Form className="">
              <div className="input-group">
                <Form.Control
                  type="text"
                  placeholder="Search for a customer using first name, last name, email, or phone number"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="form-control-sm py-2"
                />
                <span className="input-group-text bg-white text-gray-800">
                  <i className="fas fa-search"></i>
                </span>
              </div>
            </Form>
            <button
              className="buttonStyle mt-3 text-sm"
              onClick={() => (window.location.href = "/admin/add-customer")}
            >
              ADD NEW CUSTOMER
            </button>
          </div>

          {loading && <p>Loading customers...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && !error && searchQuery && (
            <Table striped bordered hover responsive className="mt-4">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Select</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length > 0 ? (
                  filteredCustomers.map((customer) => (
                    <tr
                      key={customer.customer_id}
                      onClick={() => handleSelectCustomer(customer)}
                    >
                      <td>{customer.customer_first_name}</td>
                      <td>{customer.customer_last_name}</td>
                      <td>{customer.customer_email}</td>
                      <td>{customer.customer_phone}</td>
                      <td>
                        <button className="btn btn-sm ">
                          <i className="fas fa-hand-pointer hover:text-blue-700"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          )}
        </>
      )}
    </div>
  );
};

export default AddOrderForm;