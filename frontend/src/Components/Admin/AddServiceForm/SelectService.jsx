import { useState, useEffect } from "react";

const ServiceSelection = ({ onSelectServices }) => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/services");
        const data = await response.json();
        setServices(data.services);
        setError(null);
      } catch (err) {
        setError("Failed to fetch services");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleServiceSelect = (serviceId) => {
    const updatedServices = selectedServices.includes(serviceId)
      ? selectedServices.filter((id) => id !== serviceId)
      : [...selectedServices, serviceId];

    setSelectedServices(updatedServices);

    // Now only call onSelectServices after updating selectedServices
    onSelectServices(updatedServices);
  };

  return (
    <div className="service-selection mt-4 container-width">
      <h4>Choose Service</h4>
      {loading && <p>Loading services...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && services.length > 0 && (
        <div className="list-group">
          {services.map((service) => (
            <div key={service.service_id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>{service.service_name}</h5>
                  <p>{service.service_description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedServices.includes(service.service_id)}
                  onChange={() => handleServiceSelect(service.service_id)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceSelection;
