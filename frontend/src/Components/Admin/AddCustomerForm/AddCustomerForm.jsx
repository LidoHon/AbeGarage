import { useState } from "react";
// import employee.service.js
import customerService from "../../services/customer.service";
// Import the useAuth hook
import { useAuth } from "../../../Contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddCustomerForm(props) {
  const [customer_email, setEmail] = useState("");
  const [customer_first_name, setFirstName] = useState("");
  const [customer_last_name, setLastName] = useState("");
  const [customer_phone, setPhoneNumber] = useState("");
  const [customer_password, setPassword] = useState("");
  const [active_customer, setActive_customer] = useState(1);

  // Errors
  const [emailError, setEmailError] = useState("");
  const [firstNameRequired, setFirstNameRequired] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Create a variable to hold the user's token
  let loggedInCustomerToken = "";
  // Destructure the auth hook and get the token
  const { customer } = useAuth();
  if (customer && customer.customer_token) {
    loggedInCustomerToken = customer.customer_token;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    if (!customer_first_name) {
      setFirstNameRequired("First name is required");
      valid = false;
    } else {
      setFirstNameRequired("");
    }
    if (!customer_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!customer_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(customer_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }
    // Password has to be at least 6 characters long
    if (!customer_password || customer_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }
    // If the form is not valid, do not submit
    if (!valid) {
      return;
    }
    const formData = {
      customer_email,
      customer_first_name,
      customer_last_name,
      customer_phone,
      customer_password,
      active_customer,
    };
    // Pass the form data to the service
    const newCustomer = customerService.createCustomer(
      formData,
      loggedInCustomerToken
    );
    newCustomer
      .then((response) => response.json())
      .then((data) => {
        // console.log(data);
        // If Error is returned from the API server, set the error message
        if (data.error) {
          setServerError(data.error);
        } else {
          // Handle successful response
          setSuccess(true);
          setServerError("");
          // Redirect to the employees page after 2 seconds
          // For now, just redirect to the home page
          setTimeout(() => {
            window.location.href = "/admin/customers";
          }, 2000);
        }
      })
      // Handle Catch
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
        <div className="flex items-center gap-3 mb-4">
          <h2 className="page-titles text-3xl font-bold mb-4">
            Add a new customer
          </h2>
          <div className="h-1 w-16 bg-red-500 mr-2 mt-2"></div>
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
                        type="email"
                        name="customer_email"
                        value={customer_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Customer email"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                      {emailError && (
                        <div className="validation-error" role="alert">
                          {emailError}
                        </div>
                      )}
                    </div>
                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_first_name"
                        value={customer_first_name}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="Customer first name"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                      {firstNameRequired && (
                        <div className="validation-error" role="alert">
                          {firstNameRequired}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_last_name"
                        value={customer_last_name}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Customer last name"
                        required
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="customer_phone"
                        value={customer_phone}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="Customer phone (555-555-5555)"
                        required
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12 relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="customer_password"
                        value={customer_password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Customer password"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} 
                        className="absolute right-6 top-1/2 transform -translate-y-1/2"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                      </button>
                      {passwordError && (
                        <div className="validation-error" role="alert">
                          {passwordError}
                        </div>
                      )}
                    </div>

                    <div className="form-group col-md-12">
                      <button
                        className="buttonStyle"
                        type="submit"
                        data-loading-text="Please wait..."
                      >
                        <span>Add customer</span>
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

export default AddCustomerForm;