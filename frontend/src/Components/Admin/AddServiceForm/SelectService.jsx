// ServiceSelection.js
import React, { useState, useEffect } from "react";
import { ListGroup, ListGroupItem, Spinner, Alert, Form, Container, Row, Col } from 'react-bootstrap';
const ServiceSelection = ({ onSelectServices }) => {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [error, setError] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [additionalRequest, setAdditionalRequest] = useState({
    price: '',
    description: ''
  });
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/api/services");
        const data = await response.json();
        console.log(
          "Data received from API (service):",
          JSON.stringify(data, null, 2)
        );
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
    if (selectedServices.includes(serviceId)) {
      setSelectedServices((prev) => prev.filter((id) => id !== serviceId));
    } else {
      setSelectedServices((prev) => [...prev, serviceId]);
    }
    onSelectServices(selectedServices); // Notify parent component of selection change
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdditionalRequest((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="service-selection mt-4">
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
      <div className="mt-4">
        <h4>Additional Request</h4>
        <Form>
          <Form.Group as={Row} className="mb-3">
            {/* <Form.Label column sm={2}>Service Description</Form.Label> */}
            <Col sm={10}>
              <Form.Control
                type="text"
                name="description"
                value={additionalRequest.description}
                onChange={handleInputChange}
                placeholder="Enter service description"
              />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3">
            {/* <Form.Label column sm={2}>Price</Form.Label> */}
            <Col sm={10}>
              <Form.Control
                type="text"
                name="price"
                value={additionalRequest.price}
                onChange={handleInputChange}
                placeholder="Enter price"
              />
            </Col>
          </Form.Group>
        </Form>
      </div>
    </div>
  );
};

export default ServiceSelection;