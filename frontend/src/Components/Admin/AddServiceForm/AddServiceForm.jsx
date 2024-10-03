import { useState, useEffect } from "react";
import Service from "../../services/service.service";

const AddServiceForm = ({ editingService, onServiceUpdated }) => {
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editingService) {
      setServiceName(editingService.service_name);
      setServiceDescription(editingService.service_description);
    } else {
      setServiceName("");
      setServiceDescription("");
    }
  }, [editingService]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const serviceData = {
      service_name: serviceName,
      service_description: serviceDescription,
    };

    try {
      if (editingService) {
        // Edit existing service
        const updatedService = await Service.updateService(
          editingService.service_id,
          serviceData
        );
        onServiceUpdated(updatedService);
      } else {
        // Add new service
        const newService = await Service.addService(serviceData);
        onServiceUpdated(newService);
      }

      // Clear the form inputs
      setServiceName("");
      setServiceDescription("");
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="form-group mb-3">
        {/* <label htmlFor="serviceName">Service Name</label> */}
        <input
          type="text"
          className="form-control form-control-sm py-2 rounded-none px-4"
          id="serviceName"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="service name"
        />
      </div>

      <div className="form-group mb-3">
        {/* <label htmlFor="serviceDescription">Service Description</label> */}
        <textarea
          className="form-control form-control-sm py-2 rounded-none px-4"
          id="serviceDescription"
          rows="8"
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          placeholder="service description"
        ></textarea>
      </div>

      {error && <p className="text-danger">{error}</p>}

      <button
        type="submit"
        className="buttonStyle"
        disabled={!serviceName || !serviceDescription || loading}
      >
        {loading
          ? editingService
            ? "Updating..."
            : "Adding..."
          : editingService
          ? "Update Service"
          : "Add Service"}
      </button>
    </form>
  );
};

export default AddServiceForm;