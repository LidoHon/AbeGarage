import { useEffect, useState } from 'react';
import AdminMenu from '../../Components/Admin/AdminMenu/AdminMenu'; 
import AddServiceForm from '../../Components/Admin/AddServiceForm/SelectService';
import Service from '../../Components/services/service.service'; 

const Services = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [noServices, setNoServices] = useState(false); 
    const [editingService, setEditingService] = useState(null);

    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const response = await Service.getAllServices();
                if (response.status === 'success' && Array.isArray(response.services)) {
                    setServices(response.services);
                    setNoServices(response.services.length === 0);
                } else {
                    setError('Failed to fetch services.');
                }
            } catch (error) {
                setError('An error occurred while fetching services.');
            } finally {
                setLoading(false);
            }
        };

        fetchServices();
    }, []);

    const handleDeleteService = async (serviceId) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this service?');
        if (!confirmDelete) return;

        try {
            await Service.deleteService(serviceId);
            // Immediately remove the deleted service from the list
            setServices((prevServices) => prevServices.filter(service => service.service_id !== serviceId));
        } catch (error) {
            setError('Failed to delete the service.');
        }
    };

    const handleEditService = (service) => {
        setEditingService(service); 
    };

    const handleServiceUpdated = (updatedService) => {
        // Update the UI immediately after editing or adding a service
        if (editingService) {
            setServices((prevServices) =>
                prevServices.map(service =>
                    service.service_id === updatedService.service_id ? updatedService : service
                )
            );
        } else {
            setServices((prevServices) => [...prevServices, updatedService]);
        }

        setEditingService(null); 
    };

    return (
        <div>
            <div className="container-fluid admin-pages">
                <div className="row">
                    <div className="col-md-3 admin-left-side">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9 admin-right-side">
                        <h2 className="mb-4">Services we provide</h2>
                        {loading ? (
                            <p>Loading services...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : noServices ? (
                            <p>No services available yet.</p> 
                        ) : (
                            <ul className="list-group mb-4">
                                {services.map((service) => (
                                    <li key={service.service_id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div>
                                            <h5>{service.service_name}</h5>
                                            <p>{service.service_description}</p>
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-sm btn-primary me-2"
                                                onClick={() => handleEditService(service)}
                                            >
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteService(service.service_id)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <h4>{editingService ? 'Edit' : 'Add'} Service</h4>
                        <AddServiceForm
                            editingService={editingService}
                            onServiceUpdated={handleServiceUpdated}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;