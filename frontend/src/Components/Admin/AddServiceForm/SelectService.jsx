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

  const handleServiceSelect = (service) => {
    
    const updatedServices = selectedServices.some((s) => s.service_id === service.service_id)
      ? selectedServices.filter((s) => s.service_id !== service.service_id)
      : [...selectedServices, service];
  
    setSelectedServices(updatedServices);
    onSelectServices(updatedServices); 
  };

  return (
    <div className="service-selection mt-4 w-full">
      <div className="flex items-center gap-4 mt-4 mb-4">
        <h2 className="page-titles text-2xl font-bold  ">
          Choose service and assign employee
        </h2>
        <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
      </div>
      {loading && <p>Loading services...</p>}
      {error && <p className="text-danger">{error}</p>}
      {!loading && services.length > 0 && (
        <div className="list-group">
          {services.map((service) => (
            <div key={service.service_id} className="list-group-item w-full">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="text-blue-900 text-lg font-semibold">{service.service_name}</h5>
                  <p className="text-sm">{service.service_description}</p>
                </div>
                <input
                  type="checkbox"
                  checked={selectedServices.some((s) => s.service_id === service.service_id)}
                  onChange={() => handleServiceSelect(service)} 
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
