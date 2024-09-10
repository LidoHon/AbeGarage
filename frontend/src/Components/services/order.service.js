const getCustomers = async (searchQuery = "") => {
    const api_url = import.meta.env.VITE_API_URL;
    console.log("API URL:", api_url);
    console.log("Search Query in Service:", searchQuery);
  
    try {
      const response = await fetch(
        `${api_url}/api/customers?search=${searchQuery}`,
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
        const errorText = await response.text(); // Read error message
        throw new Error(
          `Failed to fetch customers: ${response.status} ${response.statusText}. ${errorText}`
        );
      }
  
      const data = await response.json();
      console.log("Data received from API:", data);
  
      // Accessing customers from data field
      return data.data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  };
  
  const getVehicles = async (customerId) => {
    const api_url = import.meta.env.VITE_API_URL;
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
        const errorText = await response.text(); // Read error message
        throw new Error(
          `Failed to fetch vehicles: ${response.status} ${response.statusText}. ${errorText}`
        );
      }
  
      const data = await response.json();
      console.log("Data received from API:", data);
  
      // Accessing vehicles from data field
      return data.data;
    } catch (error) {
      console.error("Fetch Error:", error);
      throw error;
    }
  };
  
  export default { getCustomers, getVehicles };