const vehicleService = require('../services/vehicle.service');

// Controller for creating a vehicle
const createVehicle = async (req, res) => {
    try {
        const { customer_id } = req.body; // Extract customer_id from the request body
        console.log("Customer ID:", customer_id); // Log to check

        if (!customer_id) {
            return res.status(400).json({ error: 'Customer ID is required' });
        }

        const newVehicle = await vehicleService.createVehicle(req.body, customer_id); // Pass customer_id to service
        res.status(201).json({ status: 'success', vehicle: newVehicle });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create vehicle', details: error.message });
    }
};


// Controller for getting all vehicles
async function getAllVehicles(req, res) {
    try {
        const vehicles = await vehicleService.getAllVehicles();
        res.status(200).json({ status: 'success', vehicles });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get vehicles', details: error.message });
    }
}

// Controller for getting a vehicle by ID
async function getVehicleById(req, res) {
    try {
        const vehicle = await vehicleService.getVehicleById(req.params.id);
        if (!vehicle) {
            return res.status(404).json({ error: 'Vehicle not found' });
        }
        res.status(200).json({ status: 'success', vehicle });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get vehicle', details: error.message });
    }
}

// Controller for updating a vehicle
async function updateVehicle(req, res) {
    try {
        const updatedVehicle = await vehicleService.updateVehicle(req.params.id, req.body);
        res.status(200).json({ status: 'success', vehicle: updatedVehicle });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update vehicle', details: error.message });
    }
}

// Controller for deleting a vehicle
async function deleteVehicle(req, res) {
    try {
        await vehicleService.deleteVehicle(req.params.id);
        res.status(200).json({ status: 'success', message: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete vehicle', details: error.message });
    }
}

module.exports = {
    createVehicle,
    getAllVehicles,
    getVehicleById,
    updateVehicle,
    deleteVehicle,
};