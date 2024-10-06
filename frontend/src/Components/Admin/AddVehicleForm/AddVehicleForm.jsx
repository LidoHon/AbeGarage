import { useState } from "react";
import vehicleService from "../../services/vehicle.service"; // Adjust the path accordingly
import { useAuth } from "../../../Contexts/AuthContext";

function AddVehicleForm({ customer_id, onVehicleAdded }) {
  // Add onVehicleAdded prop
  const [vehicle_year, setVehicleYear] = useState("");
  const [vehicle_make, setVehicleMake] = useState("");
  const [vehicle_model, setVehicleModel] = useState("");
  const [vehicle_type, setVehicleType] = useState("");
  const [vehicle_mileage, setVehicleMileage] = useState("");
  const [vehicle_tag, setVehicleTag] = useState("");
  const [vehicle_serial, setVehicleSerial] = useState("");
  const [vehicle_color, setVehicleColor] = useState("");
  const [active_vehicle, setActiveVehicle] = useState(1);

  // Errors
  const [yearError, setYearError] = useState("");
  const [makeError, setMakeError] = useState("");
  const [serverError, setServerError] = useState("");

  // Create a variable to hold the user's token
  let loggedInCustomerToken = "";
  const { customer } = useAuth();
  if (customer && customer.customer_token) {
    loggedInCustomerToken = customer.customer_token;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    // Year validation
    if (!vehicle_year || isNaN(vehicle_year)) {
      setYearError("Valid vehicle year is required");
      valid = false;
    } else {
      setYearError("");
    }

    // Make validation
    if (!vehicle_make) {
      setMakeError("Vehicle make is required");
      valid = false;
    } else {
      setMakeError("");
    }

    if (!valid) return;

    const formData = {
      vehicle_year,
      vehicle_make,
      vehicle_model,
      vehicle_type,
      vehicle_mileage,
      vehicle_tag,
      vehicle_serial,
      vehicle_color,
      active_vehicle,
      customer_id, // Ensure the customer_id is included in the form data
    };

    // Pass the form data to the service
    vehicleService
      .createVehicle(formData, loggedInCustomerToken)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setServerError(data.error);
        } else {
          // Call the onVehicleAdded function from props to update the parent component
          onVehicleAdded(formData); // Pass the new vehicle data
        }
      })
      .catch((error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        setServerError(resMessage);
      });
  };

  return (
    <section className="contact-section">
      <div className="auto-container">
        <div className="contact-title">
          <h2>Add Customer's vehicle</h2>
        </div>
        <div className="row clearfix">
          <div className="form-column col-lg-7">
            <div className="inner-column">
              <div className="contact-form">
                <form onSubmit={handleSubmit}>
                  <div className="row clearfix">
                    <div className="form-group col-md-12">
                      {serverError && (
                        <div className="validation-error" role="alert">
                          {serverError}
                        </div>
                      )}
                      <input
                        type="text"
                        name="vehicle_year"
                        value={vehicle_year}
                        onChange={(e) => setVehicleYear(e.target.value)}
                        placeholder="Vehicle year"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                      {yearError && (
                        <div className="validation-error" role="alert">
                          {yearError}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_make"
                        value={vehicle_make}
                        onChange={(e) => setVehicleMake(e.target.value)}
                        placeholder="Vehicle make"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                      {makeError && (
                        <div className="validation-error" role="alert">
                          {makeError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_model"
                        value={vehicle_model}
                        onChange={(e) => setVehicleModel(e.target.value)}
                        placeholder="Vehicle model"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_type"
                        value={vehicle_type}
                        onChange={(e) => setVehicleType(e.target.value)}
                        placeholder="Vehicle type"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_mileage"
                        value={vehicle_mileage}
                        onChange={(e) => setVehicleMileage(e.target.value)}
                        placeholder="Vehicle mileage"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_tag"
                        value={vehicle_tag}
                        onChange={(e) => setVehicleTag(e.target.value)}
                        placeholder="Vehicle tag"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_serial"
                        value={vehicle_serial}
                        onChange={(e) => setVehicleSerial(e.target.value)}
                        placeholder="Vehicle serial"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="vehicle_color"
                        value={vehicle_color}
                        onChange={(e) => setVehicleColor(e.target.value)}
                        placeholder="Vehicle color"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="theme-btn btn-style-one"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Add Vehicle</span>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AddVehicleForm;