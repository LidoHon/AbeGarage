import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Service from "../../services/order.service";
import ServiceSelection from "../AddServiceForm/SelectService";
import getAuth from "../../util/auth";  

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
          customer.customer_email
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          customer.customer_phone.includes(searchQuery)
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers([]);
    }
  }, [searchQuery, customers]);

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    // Fetch the vehicles for the selected customer
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

  const handleCreateOrder = async () => {
    console.log("handleCreateOrder triggered");

    if (!selectedCustomer || !selectedVehicle || !orderPrice || !estimatedCompletionDate || !additionalRequest) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Retrieve the employee data
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
        customer_first_name: selectedCustomer.customer_first_name, 
        customer_last_name: selectedCustomer.customer_last_name, 
        customer_email: selectedCustomer.customer_email,           
        vehicle_tag: selectedVehicle.vehicle_tag,   
        vehicle_mileage: selectedVehicle.vehicle_mileage,
        employee_name: `${employee.employee_first_name} ${employee.employee_last_name}`, 
        order_status: 1 
      };

      const orderInfoData = {
        order_total_price: orderPrice,
        additional_request: additionalRequest,
        estimated_completion_date: estimatedCompletionDate,
        additional_requests_completed: 0,
      };

      console.log("Sending order data:", orderData);
      console.log("Sending order info data:", orderInfoData);
      console.log("Sending order services data:", selectedServices);  

      // Create the full order with services
      await Service.createOrder({
        orderData,
        orderInfoData,
        orderServiceData: selectedServices,  
      });

      alert("Order created successfully.");
      navigate("/admin/orders");
    } catch (err) {
      console.error("Error creating the order:", err);
      setError("Error creating the order. Please try again.");
    }
  };

  

  const handleSelectServices = (services) => {
    const updatedServiceData = services.map(serviceId => ({
      service_id: serviceId,
      service_completed: 0,
    }));
  
    setSelectedServices(updatedServiceData);
    console.log("Selected services updated:", updatedServiceData); 
  };

  const generateOrderHash = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  return (
    <div className="container">
      <h2 className="mb-4">Create a new order</h2>

      {selectedCustomer ? (
        <div className="selected-customer-details card p-3">
          <div className="row">
            <div className="col-10">
              <h3>
                {selectedCustomer.customer_first_name} {selectedCustomer.customer_last_name}
              </h3>
              <p>Email: {selectedCustomer.customer_email}</p>
              <p>Phone Number: {selectedCustomer.customer_phone}</p>
              <p>Active Customer: {selectedCustomer.active_customer ? "Yes" : "No"}</p>
            </div>
            <div className="col-2 text-right">
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
                <p>No vehicles found for this customer.</p>
              ) : (
                <table className="table table-hover mt-3">
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
                      <tr key={vehicle.vehicle_id}>
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
                              selectedVehicle === vehicle ? "btn-success" : "btn-primary"
                            }`}
                            onClick={() => handleSelectVehicle(vehicle)}
                          >
                            {selectedVehicle === vehicle ? "Selected" : "Select"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}

          {selectedVehicle && (
            <div className="selected-vehicle-details card p-3 mt-4">
              <h4>{selectedVehicle.vehicle_model}</h4>
              <p>Vehicle Year: {selectedVehicle.vehicle_year}</p>
              <p>Vehicle Type: {selectedVehicle.vehicle_type}</p>
              <p>Vehicle Mileage: {selectedVehicle.vehicle_mileage}</p>
              <p>Tag: {selectedVehicle.vehicle_tag}</p>
              <p>Plate: {selectedVehicle.vehicle_serial}</p>
            </div>
          )}

          {/* Render Service Selection Component */}
          <ServiceSelection onSelectServices={handleSelectServices} />

          {/* Additional Request, Price, and Estimated Completion Date Inputs */}
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
            onChange={(e) => setEstimatedCompletionDate(e.target.value)}
          />

          <button className="btn btn-danger mt-4" onClick={handleCreateOrder}>
            Submit Order
          </button>
        </div>
      ) : (
        <>
          <div className="search-bar">
            <input
              type="text"
              className="form-control"
              placeholder="Search for a customer"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              className="btn btn-danger mt-3"
              onClick={() => (window.location.href = "/admin/add-customer")}
            >
              Add New Customer
            </button>
          </div>

          {loading && <p>Loading customers...</p>}
          {error && <p className="text-danger">{error}</p>}

          {!loading && !error && searchQuery && (
            <table className="table table-hover mt-4">
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
                    <tr key={customer.customer_id}>
                      <td>{customer.customer_first_name}</td>
                      <td>{customer.customer_last_name}</td>
                      <td>{customer.customer_email}</td>
                      <td>{customer.customer_phone}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => handleSelectCustomer(customer)}
                        >
                          Select
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
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AddOrderForm;
