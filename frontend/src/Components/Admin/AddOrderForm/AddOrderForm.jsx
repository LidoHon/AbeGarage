import { useState, useEffect } from "react";
import Service from "../../services/order.service";
import { Modal } from "react-bootstrap";
import ServiceSelection from "../AddServiceForm/SelectService";

const AddOrderForm = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [customers, setCustomers] = useState([]); // Ensure customers is initialized as an array
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [noResults, setNoResults] = useState(false);
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);

  // Fetch customers based on the search query
  useEffect(() => {
    if (searchQuery) {
      const fetchCustomers = async () => {
        setLoading(true);
        try {
          const customersData = await Service.getCustomers(searchQuery);
          setCustomers(customersData || []); // Ensure it defaults to an array if undefined
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
      setNoResults(filtered.length === 0);
    } else {
      setFilteredCustomers([]);
      setNoResults(false);
    }
  }, [searchQuery, customers]);

  const handleSelectCustomer = async (customer) => {
    setSelectedCustomer(customer);
    // Fetch the vehicles for the selected customer
    try {
      setLoading(true);
      const vehiclesData = await Service.getVehicles(customer.customer_id);
      setVehicles(vehiclesData || []); // Ensure vehiclesData defaults to an array
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
    if (!selectedCustomer || !selectedVehicle) {
      alert("Please select both a customer and a vehicle.");
      return;
    }

    try {
      const orderData = {
        customer_id: selectedCustomer.customer_id,
        vehicle_id: selectedVehicle.vehicle_id,
        // Add any other necessary fields for the order
      };
      await Service.createOrder(orderData);
      alert("Order created successfully.");
    } catch (err) {
      setError("Error creating the order. Please try again.");
    }
  };

  const handleSelectServices = (services) => {
    setSelectedServices(services);
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
                        <td>{vehicle.vehicle_color}</td>
                        <td>
                          <button
                            className={`btn btn-sm ${
                              selectedVehicle === vehicle
                                ? "btn-success"
                                : "btn-primary"
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
                {filteredCustomers.map((customer) => (
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
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default AddOrderForm;
