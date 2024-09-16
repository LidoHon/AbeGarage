const db = require('../config/db.config');

// Fetch all services from the common_services table
const getAllServices = async () => {
    try {
        const query = 'SELECT * FROM common_services';
        const services = await db.query(query); 
        return services;
    } catch (error) {
        console.error('Error fetching services from the database:', error);
        throw new Error('Error fetching services');
    }
};

// Create a new service in the common_services table
const createService = async ({ service_name, service_description }) => {
    console.log(`Starting service creation process...`);
    console.log(`Executing query: INSERT INTO common_services (service_name, service_description) VALUES (?, ?) with values [${service_name}, ${service_description}]`);

    const query = 'INSERT INTO common_services (service_name, service_description) VALUES (?, ?)';

    try {
        // Execute the query and get the ResultSetHeader directly
        const result = await db.query(query, [service_name, service_description]);
        console.log("Raw query result:", result);
        const rows = result; 

        console.log("Processed query result (ResultSetHeader):", rows);

        // Check if the query succeeded by verifying affectedRows
        if (rows && rows.affectedRows === 1) {
            return {
                service_id: rows.insertId,
                service_name,
                service_description,
            };
        } else {
            throw new Error(`Failed to create service. Affected rows: ${(rows ? rows.affectedRows : 'undefined')}`);
        }
    } catch (error) {
        console.error('Error during service creation:', error.message);
        throw new Error("Service creation failed");
    }
};


// Update an existing service in the common_services table
const updateService = async (serviceId, { service_name, service_description }) => {
    console.log(`Attempting to update service with ID: ${serviceId}`);
    console.log(`Updating service with name: ${service_name} and description: ${service_description}`);
    
    const query = `
        UPDATE common_services 
        SET service_name = ?, service_description = ?
        WHERE service_id = ?`;

    try {
        const result = await db.query(query, [service_name, service_description, serviceId]);
        console.log("Raw query result:", result);

        // Check if the update succeeded
        if (result && result.affectedRows === 1) {
            console.log(`Service updated successfully. ID: ${serviceId}`);
            return {
                service_id: serviceId,
                service_name,
                service_description,
            };
        } else {
            throw new Error('Failed to update service or service not found');
        }
    } catch (error) {
        console.error('Error updating service:', error.message);
        throw new Error('Service update failed');
    }
};


// Delete a service from the common_services table
const deleteService = async (serviceId) => {
    console.log(`Attempting to delete service with ID: ${serviceId}`);
    
    const query = 'DELETE FROM common_services WHERE service_id = ?';

    try {
        const result = await db.query(query, [serviceId]);
        console.log("Raw query result:", result);

        // Check if the delete operation succeeded
        if (result && result.affectedRows === 1) {
            console.log(`Service deleted successfully. ID: ${serviceId}`);
            return {
                message: `Service with ID ${serviceId} deleted successfully`,
            };
        } else {
            throw new Error('Service not found or failed to delete');
        }
    } catch (error) {
        console.error('Error deleting service:', error.message);
        throw new Error('Service deletion failed');
    }
};

module.exports = {
    getAllServices,
    createService,
    updateService,
    deleteService,
};
