const api_url = import.meta.env.VITE_API_URL;
const getCustomers = async (searchQuery = "") => {
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
    console.log("Data received from API(customers):", data);

    // Accessing customers from data field
    return data.data;
  } catch (error) {
    console.error("Fetch Error:", error);
    throw error;
  }
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
      const errorText = await response.text(); // Read error message
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
    const response = await fetch("http://localhost:8000/api/services", {
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

export default { getCustomers, getVehicles, getServices };
