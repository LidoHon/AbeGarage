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

// get employees by their role
async function getEmployeesByRole(roleId) {
  console.log(`[Frontend] Fetching employees for role: ${roleId}`);
  
  try {
    const response = await fetch(`${api_url}/api/employees/role/${roleId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('employee_token')}`, 
      },
    });

    console.log(`[Frontend] Response status for role ${roleId}:`, response.status);

    if (!response.ok) {
      throw new Error(`[Frontend] Error fetching employees for role ${roleId}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`[Frontend] Data received from API (employees for role ${roleId}):`, data);

    return data.data;
  } catch (error) {
    console.error(`[Frontend] Error fetching employees for role ${roleId}:`, error);
    throw error;
  }
}

// Create an order (for the customer with vehicle, services, and employee assignments)
const createOrder = async (OrderData) => {
  try {
    // Log the entire order data including employee-service assignments
    console.log("Outgoing OrderData:", JSON.stringify(OrderData));

    const response = await fetch(`${api_url}/api/order/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('employee_token')}`, 
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
const getAllOrders = async () => {
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
    if (data && data.status === 'success') {
      // Correct data is received, return it
      return data.data; 
    } else {
      throw new Error("Order details not found or improperly formatted.");
    }
    
  } catch (error) {
    console.error('Error fetching order details from API:', error);
    throw error;
  }
};




// get order id from the task
const getOrderIdFromTask = async (orderServiceId) => {
  try {
    const response = await fetch(`${api_url}/api/order/task/${orderServiceId}/order-id`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching order ID for task ${orderServiceId}: ${response.statusText}`);
    }

    const data = await response.json();
    return data.order_id;
  } catch (error) {
    console.error("Error in getOrderIdFromTask:", error);
    throw error;
  }
};

//get all services for a specific order
const getAllServicesForOrder = async (orderId) => {
  try {
    const response = await fetch(`${api_url}/api/order/${orderId}/services`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching services for order ${orderId}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in getAllServicesForOrder:", error);
    throw error;
  }
};


// Update the status of an order
const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await fetch(`${api_url}/api/order/${orderId}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('employee_token')}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error(`Error updating order status for order ${orderId}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    throw error;
  }
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
  getEmployeesByRole,
  createOrder,
  getAllOrders,
  getOrderDetails,
  getOrderIdFromTask,
  getAllServicesForOrder,
  deleteOrder,
  updateOrderStatus,
};

