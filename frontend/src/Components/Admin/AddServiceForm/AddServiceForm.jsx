import { useState, useEffect } from "react";
import Service from "../../services/service.service";
import { toast } from "react-toastify"; 

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
      let response;
      if (editingService) {
        response = await Service.updateService(editingService.service_id, serviceData);
      } else {
        response = await Service.addService(serviceData);
      }
  
      if (response && response.status === "success") {
        onServiceUpdated(response.service); 
        toast.success(`${editingService ? "Service updated" : "Service added"} successfully!`);
  
        // Reset form fields
        setServiceName("");
        setServiceDescription("");
      } else {
        setError("Failed to add or update service. Please try again.");
        toast.error("Failed to save service.");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="form-group mb-3">
        <input
          type="text"
          className="form-control form-control-sm py-2 rounded-none px-4"
          id="serviceName"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          placeholder="Service Name"
        />
      </div>

      <div className="form-group mb-3">
        <textarea
          className="form-control form-control-sm py-2 rounded-none px-4"
          id="serviceDescription"
          rows="8"
          value={serviceDescription}
          onChange={(e) => setServiceDescription(e.target.value)}
          placeholder="Service Description"
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
