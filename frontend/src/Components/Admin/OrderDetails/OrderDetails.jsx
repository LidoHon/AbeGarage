import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Service from "../../services/order.service";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        const data = await Service.getOrderDetails(orderId);
        if (data) {
          setOrderDetails(data);
        } else {
          setError("No order details found.");
        }
      } catch (err) {
        setError("Error fetching order details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchOrderDetails();
  }, [orderId]);
  

  if (loading) {
    return <p>Loading order details...</p>;
  }

  if (error) {
    return <p className="text-red-600">{error}</p>;
  }

  console.log("Order Details in OrderDetails Component:", orderDetails);
  if (!orderDetails) {
    return <p>No order details found.</p>;
  }

  const statusMap = {
    1: "Received",
    2: "In progress",
    3: "Completed",
  };

  const orderStatusText = statusMap[orderDetails.overall_order_status] || "Unknown status";

    const services = orderDetails.service_name
    ? orderDetails.service_name.split(", ")
    : [];
  const serviceDescriptions = orderDetails.service_descriptions
    ? orderDetails.service_descriptions.split("; ")
    : [];
  const serviceStatuses = orderDetails.service_statuses
    ? orderDetails.service_statuses.split(", ")
    : [];
    const vehicleMileage = orderDetails.vehicle_mileage || "N/A";

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-4">
          <h2 className="page-titles text-3xl font-bold">
            {orderDetails.customer_first_name} {orderDetails.customer_last_name}
          </h2>
          <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
        </div>
        <span
          className={`text-lg font-bold px-4 py-2 rounded-full ${
            orderDetails.overall_order_status === 3
              ? "bg-green-500 text-white"
              : orderDetails.overall_order_status === 2
              ? "bg-yellow-300 text-black"
              : "bg-gray-500 text-white"
          }`}
        >
          {orderStatusText}
        </span>
      </div>

      <p className="text-gray-600 mb-6">
        You can track the progress of your order using this page. We will
        constantly update this page to let you know how we are progressing. As
        soon as we are done with the order, the status will turn green. That
        means your car is ready for pickup.
      </p>

      <div className="flex flex-col md:flex-row gap-4 mx-20 service-block-one">
        {/* Customer Info */}
        <div className="inner-box hvr-float-shadow w-full md:w-1/2">
          <h5 className="font-semibold">Customer</h5>
          <p className="font-bold">
            {orderDetails.customer_first_name} {orderDetails.customer_last_name}
          </p>
          <p>Email: {orderDetails.customer_email}</p>
          <p>Phone Number: {orderDetails.customer_phone}</p>
          <p>
            Active Customer:{" "}
            <span
              className={
                orderDetails.active_customer ? "text-green-500" : "text-red-500"
              }
            >
              {orderDetails.active_customer ? "Yes" : "No"}
            </span>
          </p>
        </div>

        {/* Car in Service Info */}
        <div className="inner-box hvr-float-shadow w-full md:w-1/2">
          <h5 className="font-semibold">Car in Service</h5>
          <p className="font-bold">
            {orderDetails.vehicle_make} {orderDetails.vehicle_model}
          </p>
          <p>Vehicle tag: {orderDetails.vehicle_tag}</p>
          <p>Vehicle year: {orderDetails.vehicle_year}</p>
          <p>Vehicle mileage: {vehicleMileage}</p>
        </div>
      </div>

      <div className="service-block-one mx-20">
        <div className="inner-box hvr-float-shadow">
          <h5 className="font-bold text-4xl mb-4">Requested Services</h5>
          {services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b-2 border-gray-200 pb-3 mb-3"
              >
                <div>
                  <h6 className="font-semibold text-xl">{service}</h6>
                  <p className="text-gray-600 text-sm">
                    {serviceDescriptions[index]}
                  </p>
                </div>
                <span
                  className={`text-md font-semibold px-4 py-2 rounded-full ${
                    serviceStatuses[index] === "3"
                      ? "bg-green-500 text-white"
                      : serviceStatuses[index] === "2"
                      ? "bg-yellow-300 text-black"
                      : "bg-gray-500 text-white"
                  }`}
                >
                  {statusMap[serviceStatuses[index]] || "Unknown status"}
                </span>
              </div>
            ))
          ) : (
            <h1 className="text-xl font-bold text-center text-gray-600 p-4 bg-gray-200 rounded-lg">
              No services requested.
            </h1>
          )}
        </div>
      </div>

      <div className="service-block-one mx-20">
        <div className="inner-box hvr-float-shadow">
          <h5 className="font-bold text-3xl mb-2">Order Information</h5>
          <p className="text-blue-900">
            Total Price:{" "}
            <span className="text-black">${orderDetails.order_total_price}</span>
          </p>
          <p className="text-blue-900">
            Estimated Completion Date:{" "}
            <span className="text-black">
              {new Date(
                orderDetails.estimated_completion_date
              ).toLocaleString()}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
