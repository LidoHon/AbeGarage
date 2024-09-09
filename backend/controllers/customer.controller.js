// Import the customer service
const customerService = require("../services/customer.service");

// Create the add customer controller
async function createCustomer(req, res, next) {
    // Check if customer email already exists in the database
    const customerExists = await customerService.checkIfCustomerExists(req.body.customer_email);

    // If customer exists, send a response to the client
    if (customerExists) {
        res.status(400).json({
            error: "This email address is already associated with another customer!",
        });
    } else {
        try {
            const customerData = req.body;
            // Create the customer
            const customer = await customerService.createCustomer(customerData);
            if (!customer) {
                res.status(400).json({
                    error: "Failed to add the customer!",
                });
            } else {
                res.status(200).json({
                    status: "true",
                });
            }
        } catch (error) {
            console.log(error);
            res.status(400).json({
                error: "Something went wrong!",
            });
        }
    }
}

// Get all customers or search based on query
async function getAllCustomers(req, res, next) {
    const searchQuery = req.query.search || '';
    // Pass the query to the service
    const customers = await customerService.getAllCustomers(searchQuery);  
    if (!customers) {
        res.status(400).json({
            error: "Failed to get all customers!",
        });
    } else {
        res.status(200).json({
            status: "success",
            customers: customers,
        });
    }
}

// Controller to get a customer profile by ID
async function getCustomerProfile(req, res, next) {
    const customerId = req.params.customerId;
    try {
        const customer = await customerService.getCustomer(customerId);
        if (!customer) {
            return res.status(404).json({
                status: "fail",
                message: "Customer not found",
            });
        }
        res.status(200).json({
            status: "success",
            data: customer,
        });
    } catch (error) {
        console.error("Error fetching customer profile:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching the customer profile",
        });
    }
}

// Controller to get vehicles for a customer
async function getCustomerVehicles(req, res, next) {
    const customerId = req.params.customerId;
    try {
        const vehicles = await customerService.getVehiclesByCustomerId(customerId);
        if (!vehicles || vehicles.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No vehicles found for this customer",
            });
        }
        res.status(200).json({
            status: "success",
            data: vehicles,
        });
    } catch (error) {
        console.error("Error fetching customer vehicles:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching customer vehicles",
        });
    }
}

// Controller to get orders for a customer
async function getCustomerOrders(req, res, next) {
    const customerId = req.params.customerId;
    try {
        const orders = await customerService.getOrdersByCustomerId(customerId);
        if (!orders || orders.length === 0) {
            return res.status(404).json({
                status: "fail",
                message: "No orders found for this customer",
            });
        }
        res.status(200).json({
            status: "success",
            data: orders,
        });
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching customer orders",
        });
    }
}

// Controller to update a customer
async function updateCustomer(req, res, next) {
    const customer_id = req.params.id;
    const customerData = req.body;

    try {
        const updated = await customerService.updateCustomer(customer_id, customerData);
        if (updated) {
            res.status(200).json({
                status: "success",
                message: "Customer updated successfully!",
            });
        } else {
            res.status(400).json({
                error: "Failed to update the customer!",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: "An error occurred while updating the customer!",
        });
    }
}

// Handle deleting a customer
async function deleteCustomer(req, res) {
    try {
        const customer_id = req.params.id;

        // Call the deleteCustomer method from the customer service
        const result = await customerService.deleteCustomer(customer_id);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "fail",
                message: "Customer not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: `Customer with ID ${customer_id} deleted successfully`,
        });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({
            status: "error",
            message: "An error occurred while deleting the customer",
        });
    }
}

// Export the customer controllers
module.exports = {
    createCustomer,
    getAllCustomers,
    getCustomerProfile,   
    getCustomerVehicles,  
    getCustomerOrders,    
    updateCustomer,
    deleteCustomer,
};
