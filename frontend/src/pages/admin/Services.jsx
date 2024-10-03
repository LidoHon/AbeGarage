import { useEffect, useState } from 'react';
import AdminMenu from '../../Components/Admin/AdminMenu/AdminMenu'; 
import AddServiceForm from '../../Components/Admin/AddServiceForm/AddServiceForm';
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
        // Update the UI immediately after editing 
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
        <div className="px-2">
            <div className="container-fluid admin-pages">
                <div className="row">
                    <div className="col-md-3 admin-left-side">
                        <AdminMenu />
                    </div>
                    <div className="services-section col-md-9 px-4">
                        <div className="flex items-center gap-4 mb-2">
                            <h2 className="page-titles text-3xl font-bold mb-4">Services we provide </h2>
                            <div className="h-1 w-16 bg-red-500 mr-2 mt-2"></div>
                        </div>
                        <p className="text-gray-600 mb-6">
                        Our skilled team provides comprehensive garage services, ensuring every vehicle receives expert care and attention. From routine inspections to advanced mechanical repairs, we guarantee efficient and high-quality service delivery for all jobs.
                        </p>
                        {loading ? (
                            <p>Loading services...</p>
                        ) : error ? (
                            <p className="text-danger">{error}</p>
                        ) : noServices ? (
                            <p>No services available yet.</p> 
                        ) : (
                            <ul className="list-group mb-4">
                                {services.map((service) => (
                                    <li key={service.service_id} className="list-group-item d-flex justify-content-between align-items-center mb-1 ">
                                        <div>
                                            <h4 className="font-bold page-titles">{service.service_name}</h4>
                                            <p className="text-sm">{service.service_description}</p>
                                        </div>
                                        <div>
                                            <button
                                                className="btn btn-sm text-red-500 "
                                                onClick={() => handleEditService(service)}
                                            >
                                                <i className="fa fa-edit"></i>
                                            </button>
                                            <button
                                                className="btn btn-sm ml-2"
                                                onClick={() => handleDeleteService(service.service_id)}
                                            >
                                                <i className="fa fa-trash"></i>
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="bg-white p-4">
                        <div className="flex items-center gap-3 mb-2">
                            <h4 className="page-titles font-bold text-xl">{editingService ? 'Edit' : 'Add a new'} Service</h4>
                                <div className="h-1 w-14 bg-red-500 mr-2 mt-2"></div>
                        </div>
                            <AddServiceForm
                                editingService={editingService}
                                onServiceUpdated={handleServiceUpdated}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Services;