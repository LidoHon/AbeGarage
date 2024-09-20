import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import customerService from "../../Components/services/customer.service";

// Reusable Section component for different sections of the page
const Section = ({ className, style, children }) => (
  <section className={className} style={style}>
    <div className="auto-container" style={{ maxWidth: "90%" }}>
      {children}
    </div>
  </section>
);

const OrderDetail = () => {
  const { order_id } = useParams(); // Get order ID from the URL
  const [customerData, setCustomerData] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [requestedServices, setRequestedServices] = useState([]);
  
  const token = localStorage.getItem("token"); // Assuming you store the token in localStorage

  // Fetching customer data using order ID
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const res = await customerService.getCustomer(order_id, token);
        const data = await res.json();
        console.log("Customer data response:", data);
        setCustomerData(data.data);
      } catch (error) {
        console.error("Error fetching customer data", error);
      }
    };

    fetchCustomerData();
  }, [order_id, token]);

  // Fetching vehicles based on order ID
  useEffect(() => {
    const fetchCustomerVehicles = async () => {
      try {
        const res = await customerService.getCustomerVehicles(order_id, token);
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
  }, [order_id, token]);

  // Fetching requested services based on order ID
  useEffect(() => {
    const fetchRequestedServices = async () => {
        try {
            const res = await customerService.getRequestedServicesForOrder(order_id, token);
            const data = await res.json();
            console.log("Requested Services data response:", data);
            if (data.success) {
                setRequestedServices(data.data);
            } else {
                setRequestedServices([]);
            }
        } catch (error) {
            console.error("Error fetching requested services", error);
        }
    };

    fetchRequestedServices();
}, [order_id, token]);

  if (!customerData) {
    return <div>Loading...</div>;
  }

  return (
    <Section className="services-section">
      <div className="auto-container">
        <div className="sec-title style-two">
          <div className="row">
            <div className="col-lg-10 col-md-8">
              <h2>{`${customerData.customer_first_name} ${customerData.customer_last_name}`}</h2>
            </div>
            <div className="col-lg-2 col-md-4">
              <span
                style={{
                  display: 'inline-block',
                  padding: '5px 45px',
                  borderRadius: '10px',
                  backgroundColor: customerData?.active_order === 0 ? 'yellow' : 'green',
                  color: 'white',
                }}
              >
                {customerData?.active_order === 0 ? "In Progress" : "Completed"}
              </span>
            </div>
          </div>
          <br/>
          <p>
            You can track the progress of your order using this page. We will
            constantly update this page to let you know how we are
            progressing. As soon as we are done with the order, the status will
            turn green. That means your car is ready for pickup.
          </p>
        </div>

        <div className="row">
          {/* Customer Information */}
          <div className="col-lg-6 service-block-one marginBottom" style={{ padding: "" }}>
            <div className="inner-box hvr-float-shadow">
              <h5>CUSTOMER</h5>
              {customerData && (
                <div className="selected-customer-details card p-3" style={{ marginRight: '1rem', marginBottom: "5px" }}>
                  <h3><b>{`${customerData.customer_first_name} ${customerData.customer_last_name}`}</b></h3>
                  <p><b>Email:</b> {customerData.customer_email}</p>
                  <p><b>Phone Number:</b> {customerData.customer_phone}</p>
                  <p><b>Active Customer:</b> {customerData.active_customer ? "Yes" : "No"}</p>
                </div>
              )}
            </div>
          </div>

          {/* Vehicles Information */}
          <div className="col-lg-6 service-block-one marginBottom">
            <div className="inner-box hvr-float-shadow">
              <h5>CAR IN SERVICE</h5>
              {vehicles.length > 0 ? (
                <ul>
                  {vehicles.map((vehicle) => (
                    <li key={vehicle.vehicle_id} className="selected-vehicle-details card p-3" style={{ marginRight: '1rem', marginBottom: "5px" }}>
                      <strong>
                        {vehicle.vehicle_make} : {vehicle.vehicle_model} ({vehicle.vehicle_color})
                      </strong>
                      <p><b>Vehicle tag:</b> {vehicle.vehicle_tag}</p>
                      <p><b>Vehicle year:</b> {vehicle.vehicle_year}</p>
                      <p><b>Vehicle mileage:</b> {vehicle.vehicle_mileage}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No vehicles found</p>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          {/* Requested Service Information */}
          <div className="service-block-one marginBottom">
            <div className="inner-box hvr-float-shadow">
              <h5>REQUESTED SERVICES BY: <b>{customerData.customer_first_name}</b></h5>
              <div className="selected-vehicle-details card p-3" style={{ marginRight: '1rem', marginBottom: "10px" }}>
                {requestedServices.length > 0 ? (
                  <ul>
                    {requestedServices.map((service) => (
                      <li key={service.service_id}>
                        <h5 className="order-text2">{service.service_name}</h5>
                        <div className="col-10">{service.service_description}</div>
                        <div className="col-2">
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '5px 10px',
                              borderRadius: '3px',
                              backgroundColor: service.service_completed ? 'green' : 'yellow',
                              color: 'white',
                            }}
                          >
                            {service.service_completed ? "Completed" : "In Progress"}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No requested services found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default OrderDetail;