import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Service from "../../services/order.service";
import ServiceSelection from "../AddServiceForm/SelectService";

const EditOrderForm = () => {
  const location = useLocation();
  const { orderData } = location.state || {}; // Get the orderData from the navigation state

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalRequest, setAdditionalRequest] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [estimatedCompletionDate, setEstimatedCompletionDate] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (orderData) {
      console.log('Order Data:', orderData); // Debugging: Log the orderData received
  
      setSelectedCustomer({
        customer_first_name: orderData.customer_first_name,
        customer_last_name: orderData.customer_last_name,
        customer_email: orderData.customer_email,
        customer_phone: orderData.customer_phone,
        active_customer: orderData.active_customer,
      });
  
      setSelectedVehicle({
        vehicle_make: orderData.vehicle_make,
        vehicle_model: orderData.vehicle_model,
        vehicle_year: orderData.vehicle_year,
        vehicle_type: orderData.vehicle_type,
        vehicle_mileage: orderData.vehicle_mileage,
        vehicle_tag: orderData.vehicle_tag,
        vehicle_serial: orderData.vehicle_serial,
      });
  
      // Check and populate additionalRequest, orderPrice, and estimatedCompletionDate
      setAdditionalRequest(orderData.additional_request || "");
      setOrderPrice(orderData.order_total_price || "");
      setEstimatedCompletionDate(orderData.estimated_completion_date || "");
  
      // If selectedServices exist in orderData, set them in the state
      if (orderData.selectedServices) {
        const formattedServices = orderData.selectedServices.map((service) => ({
          service_id: service.service_id,
          service_completed: service.service_completed || 0,
        }));
        setSelectedServices(formattedServices);
        console.log('Pre-selected services:', formattedServices); // Debugging: Log the selected services
      }
    }
  }, [orderData]);
  

  const handleSelectServices = (services) => {
    const updatedServiceData = services.map(serviceId => ({
      service_id: serviceId,
      service_completed: 0,
    }));
    setSelectedServices(updatedServiceData);
  };

  const handleUpdateOrder = async () => {
    try {
      const orderInfoData = {
        order_total_price: orderPrice,
        additional_request: additionalRequest,
        estimated_completion_date: estimatedCompletionDate,
        additional_requests_completed: 0,
      };

      // Update order using Service
      await Service.updateOrder({
        orderId: orderData.order_id, // pass the order id for the update
        orderInfoData,
        orderServiceData: selectedServices,
      });

      alert("Order updated successfully.");
      navigate("/admin/orders");
    } catch (err) {
      console.error("Error updating the order:", err);
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Edit Order</h2>

      {selectedCustomer && (
        <div className="selected-customer-details card p-3">
          <h3>{`${selectedCustomer.customer_first_name} ${selectedCustomer.customer_last_name}`}</h3>
          <p>Email: {selectedCustomer.customer_email}</p>
          <p>Phone Number: {selectedCustomer.customer_phone}</p>
          <p>Active Customer: {selectedCustomer.active_customer ? "Yes" : "No"}</p>
        </div>
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

      {/* Service selection */}
      <ServiceSelection
        onSelectServices={handleSelectServices}
        selectedServices={selectedServices.map((service) => service.service_id)}
      />

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

      <button className="btn btn-danger mt-4" onClick={handleUpdateOrder}>
        Update Order
      </button>
    </div>
  );
};

export default EditOrderForm;
