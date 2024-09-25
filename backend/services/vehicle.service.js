const conn = require('../config/db.config');

// Service to create a new vehicle
async function createVehicle(vehicleData, customer_id) {
    const query = `
        INSERT INTO customer_vehicle_info 
        (customer_id, vehicle_year, vehicle_make, vehicle_model, vehicle_type, vehicle_mileage, vehicle_tag, vehicle_serial, vehicle_color) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    console.log("Executing query with data:", customer_id, vehicleData); // Log the data

    const result = await conn.query(query, [
        customer_id,
        vehicleData.vehicle_year,
        vehicleData.vehicle_make,
        vehicleData.vehicle_model,
        vehicleData.vehicle_type,
        vehicleData.vehicle_mileage,
        vehicleData.vehicle_tag,
        vehicleData.vehicle_serial,
        vehicleData.vehicle_color
    ]);

    console.log("Query result:", result); // Log the query result

    if (result.affectedRows === 1) {
        return { vehicle_id: result.insertId, ...vehicleData };
    } else {
        throw new Error('Failed to create vehicle');
    }
}

// Service to get all vehicles
async function getAllVehicles() {
    const query = 'SELECT * FROM customer_vehicle_info';
    const vehicles = await conn.query(query);
    return vehicles;
}

// Service to get a vehicle by ID
async function getVehicleById(vehicleId) {
    const query = 'SELECT * FROM customer_vehicle_info WHERE vehicle_id = ?';
    const rows = await conn.query(query, [vehicleId]);
    return rows.length > 0 ? rows[0] : null;
}

// Service to update a vehicle
async function updateVehicle(vehicleId, vehicleData) {
    const query = `
        UPDATE customer_vehicle_info 
        SET vehicle_year = ?, vehicle_make = ?, vehicle_model = ?, vehicle_type = ?, vehicle_mileage = ?, vehicle_tag = ?, vehicle_serial = ?, vehicle_color = ?
        WHERE vehicle_id = ?`;
    
    const result = await conn.query(query, [
        vehicleData.vehicle_year,
        vehicleData.vehicle_make,
        vehicleData.vehicle_model,
        vehicleData.vehicle_type,
        vehicleData.vehicle_mileage,
        vehicleData.vehicle_tag,
        vehicleData.vehicle_serial,
        vehicleData.vehicle_color,
        vehicleId
    ]);

    if (result.affectedRows === 1) {
        return { vehicle_id: vehicleId, ...vehicleData };
    } else {
        throw new Error('Failed to update vehicle');
    }
}

// Service to delete a vehicle
async function deleteVehicle(vehicleId) {
    const query = 'DELETE FROM customer_vehicle_info WHERE vehicle_id = ?';
    await conn.query(query, [vehicleId]);
}

module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};