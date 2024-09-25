const Service = require('../services/service.service');

// Controller to get all services
const getAllServices = async (req, res) => {
    try {
        const services = await Service.getAllServices();
        res.status(200).json({
            status: 'success',
            services: services,
        });
    } catch (error) {
        console.error('Error fetching services:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch services',
        });
    }
};

// Controller to create a new service
const createService = async (req, res) => {
    try {
        const { service_name, service_description } = req.body;
        
        // Check if both service name and description are provided
        if (!service_name || !service_description) {
            console.log('Missing service_name or service_description');
            return res.status(400).json({
                status: 'error',
                message: 'Service name and description are required',
            });
        }

        console.log('Attempting to create a new service:', { service_name, service_description });

        // Call the service to create a new service
        const newService = await Service.createService({ service_name, service_description });

        console.log('Service created successfully:', newService);

        // Respond with the newly created service
        res.status(201).json({
            status: 'success',
            message: 'Service created successfully',
            service: newService,
        });
    } catch (error) {
        console.error('Error creating service:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to create service',
        });
    }
};


// Controller to update a service
const updateService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        const { service_name, service_description } = req.body;
        if (!service_name || !service_description) {
            return res.status(400).json({
                status: 'error',
                message: 'Service name and description are required',
            });
        }

        const updatedService = await Service.updateService(serviceId, { service_name, service_description });
        res.status(200).json({
            status: 'success',
            message: 'Service updated successfully',
            service: updatedService,
        });
    } catch (error) {
        console.error('Error updating service:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to update service',
        });
    }
};

// Controller to delete a service
const deleteService = async (req, res) => {
    try {
        const serviceId = req.params.id;
        await Service.deleteService(serviceId);
        res.status(200).json({
            status: 'success',
            message: 'Service deleted successfully',
        });
    } catch (error) {
        console.error('Error deleting service:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to delete service',
        });
    }
};

module.exports = {
    getAllServices,
    createService,
    updateService,
    deleteService,
};