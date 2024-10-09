import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../services/order.service";
import ServiceSelection from "../AddServiceForm/SelectService";
import getAuth from "../../util/auth";
import { Table, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
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

  
  useEffect(() => {
    if (selectedServices.length > 0) {
      const fetchEmployees = async () => {
        try {
          const response = await Service.getEmployeesByRole(1);
          setEmployees(response);
        } catch (error) {
          console.error("Error fetching employees:", error);
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
          customer.customer_first_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.customer_last_name
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
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
    const updatedServiceData = services.map((service) => ({
      service_id: service.service_id,
      service_name: service.service_name,
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
        toast.error("Please fill in all required fields.");
        return;
      }
    
      try {
        const employee = await getAuth();
    
        if (!employee || !employee.employee_id) {
          throw new Error("Employee not found or not authenticated.");
        }
    
        
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
    
        console.log("Order Data:", orderData);
        console.log("Order Info Data:", orderInfoData);
        console.log("Order Service Data:", orderServiceData);
    
        
        await Service.createOrder({
          orderData,
          orderInfoData,
          orderServiceData,
        });
    
        
        toast.success("Order created successfully!");
        navigate("/admin/orders");
      } catch (err) {
        console.error("Error in handleCreateOrder:", err);
        toast.error("Error creating the order. Please try again.");
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
      <ToastContainer /> 
      <div className="flex items-center gap-4 mt-4 mb-4">
        <h2 className="page-titles text-3xl font-bold mb-4 mt-4">
          Create a new order
        </h2>
        <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
      </div>

      {selectedCustomer ? (
        <div className="selected-customer-detail py-3 px-10">
          <div className="flex container justify-between bg-white py-10 px-5 border ">
            <div className=" ">
              <h3 className="font-bold text-xl text-blue-900 uppercase">
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
              <div className="flex items-center gap-4 mt-4 mb-4">
                <h2 className="page-titles text-xl font-bold">
                  Choose a vehicle
                </h2>
              </div>
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
                  <Table striped bordered hover responsive className="">
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
                          <td className="text-center">
                            <button className="btn btn-sm">
                              <i className="fas fa-hand-pointer hover:text-blue-700"></i>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </>
              )}
            </>
          )}

          {selectedVehicle && (
            <>
              <div className="flex container justify-between bg-white py-6 px-5 border my-4">
                <div className="selected-vehicle-details">
                  <h4 className="font-bold text-xl text-blue-900 uppercase">
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


              <div className="flex">
                <div
                  className={`${
                    selectedServices.length === 0 ? "w-full" : "w-2/3 h-full"
                  } transition-all duration-300`}
                >
                  <ServiceSelection onSelectServices={handleSelectServices} />
                </div>

                {/* Assign Employees Section */}
                {selectedServices.length > 0 && (
                  <div className="w-1/3 ml-4 mt-12 h-full">
                    <div className="form-group mt-16 ml-8">
                      {selectedServices.map((service) => (
                        <div key={service.service_id} className="mb-2">
                          <h5 className="italic text-blue-900 text-sm ">{`Assign Employee to ${service.service_name}`}</h5>
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
                  </div>
                )}
              </div>

              {/* Additional Fields Section */}
              {selectedServices.length > 0 && (
                <div className="additional-requests mt-8  bg-white p-10">
                  <div className="flex items-center gap-4 mb-4">
                    <h5 className="text-2xl font-bold text-blue-900">
                      Additional requests
                    </h5>
                    <div className="h-1 w-16 bg-red-500"></div>
                  </div>

                  <div className="mb-4">
                    <textarea
                      className="form-control border-1  border-gray-300 focus:ring-0 focus:border-blue-500 text-lg placeholder-gray-400 py-2"
                      placeholder="Service description"
                      value={additionalRequest}
                      onChange={(e) => setAdditionalRequest(e.target.value)}
                      rows={6}
                    ></textarea>
                  </div>

                  <div className="mb-4">
                    <input
                      type="number"
                      className="form-control border-1  border-gray-300 focus:ring-0 focus:border-blue-500 text-lg placeholder-gray-400 py-2"
                      placeholder="Price"
                      value={orderPrice}
                      onChange={(e) => setOrderPrice(e.target.value)}
                    />
                  </div>

                  <div className="mb-6">
                    <input
                      type="date"
                      className="form-control border-1 border-gray-300 focus:ring-0 focus:border-blue-500 text-lg py-2"
                      value={estimatedCompletionDate}
                      onChange={(e) => setEstimatedCompletionDate(e.target.value)}
                    />
                  </div>

                  <button
                    className="buttonStyle bg-red-500 px-6 py-2 text-white text-sm font-semibold"
                    onClick={handleCreateOrder}
                  >
                    SUBMIT ORDER
                  </button>
                </div>
              )}
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
                      <td className="text-center">
                        <button className="btn btn-sm">
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
