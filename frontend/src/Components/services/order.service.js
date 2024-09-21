const api_url = import.meta.env.VITE_API_URL;

const getCustomers = async (searchQuery = '') => {
    console.log("Search Query in Service:", searchQuery); 
    const response = await fetch(`${api_url}/api/customers?search=${searchQuery}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('employee_token')}`,
        },
    });

    console.log("Response status:", response.status);
    if (!response.ok) {
        throw new Error('Failed to fetch customers');
    }

    const data = await response.json();
    console.log("Data received from API:", data);

    return data;
};

const getVehicles = async (customerId) => {
    console.log("API URL:", api_url);
    console.log("Customer ID in Service:", customerId);
  
    try {
      const response = await fetch(
        `${api_url}/api/customers/${customerId}/vehicles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("employee_token")}`,
          },
        }
      );
  
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text(); 
        throw new Error(
          `Failed to fetch vehicles: ${response.status} ${response.statusText}. ${errorText}`
        );
      }
  
      const data = await response.json();
      console.log("Data received from API (vehicles):", data);
  
      // Accessing vehicles from data field
      return data.data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  };
  
  const getServices = async () => {
    // console.log("API URL:", api_url);
  
    try {
      const response = await fetch(`${api_url}/api/services`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("employee_token")}`,
        },
      });
  
      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to fetch services: ${response.status} ${response.statusText}. ${errorText}`
        );
      }
  
      const data = await response.json();
      console.log(
        "Data received from API (service):",
        JSON.stringify(data, null, 2)
      );
  
      // Accessing services from data field
      return data.data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
};

// Create an order (for the customer and vehicle)
const createOrder = async (OrderData) => {
  try {
    console.log("Outgoing OrderData:", JSON.stringify(OrderData));
    const response = await fetch(`${api_url}/api/order/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderData: OrderData.orderData,
        orderInfoData: OrderData.orderInfoData,
        orderServiceData: OrderData.orderServiceData,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create the order');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating the full order:", error);
    throw error;
  }
};

// Fetch all orders
const getOrders = async () => {
  try {
    console.log("Sending request to API:", `${api_url}/api/orders`);
    
    const response = await fetch(`${api_url}/api/orders`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('employee_token')}`, 
      },
    });

    console.log("Received API response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text(); 
      console.error("Error in fetching orders:", errorText);
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    console.log("API response JSON:", data);
    
    return data; 
  } catch (error) {
    console.error('Error fetching orders from API:', error);
    throw error;
  }
};

// get a single order by its id
const getOrderDetails = async (orderId) => {
  try {
      const response = await fetch(`${api_url}/api/order/${orderId}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${localStorage.getItem('employee_token')}`,
          },
      });

      if (!response.ok) {
          const errorMessage = await response.text(); 
          throw new Error(`Failed to fetch order details: ${response.status} - ${errorMessage}`);
      }

      const data = await response.json();
      if (data.status === "success" && data.data) {
          return data; 
      } else {
          throw new Error("Order details not found");
      }
  } catch (error) {
      console.error('Error fetching order details from API:', error);
      throw error;
  }
};

// Update the status of an order
const updateOrderStatus = async (orderId, newStatus) => {
  const response = await fetch(`${api_url}/api/order/${orderId}/status`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('employee_token')}`,
      },
      body: JSON.stringify({ order_status: newStatus }),
  });

  if (!response.ok) {
      throw new Error('Failed to update order status');
  }

  const data = await response.json();
  return data;
};

// delete order
const deleteOrder = async (orderId) => {
  try {
    const response = await fetch(`${api_url}/api/order/${orderId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("employee_token")}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete order with ID: ${orderId}`);
    }

    const data = await response.json();
    console.log("Order deleted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export default {
  getCustomers,
  getVehicles,
  getServices,
  createOrder,
  getOrders,
  getOrderDetails,
  deleteOrder,
  updateOrderStatus,
};

