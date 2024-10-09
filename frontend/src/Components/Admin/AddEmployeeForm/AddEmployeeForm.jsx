import { useState } from "react";
// import employee.service.js
import employeeService from "../../services/employee.service";
// Import the useAuth hook
import { useAuth } from "../../../Contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function AddEmployeeForm(props) {
  const [employee_email, setEmail] = useState("");
  const [employee_first_name, setFirstName] = useState("");
  const [employee_last_name, setLastName] = useState("");
  const [employee_phone, setPhoneNumber] = useState("");
  const [employee_password, setPassword] = useState("");
  const [active_employee, setActive_employee] = useState(1);
  const [company_role_id, setCompany_role_id] = useState(1);
  const [emailError, setEmailError] = useState("");
  const [firstNameRequired, setFirstNameRequired] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // Create a variable to hold the user's token
  let loggedInEmployeeToken = "";
  // Destructure the auth hook and get the token
  const { employee } = useAuth();
  if (employee && employee.employee_token) {
    loggedInEmployeeToken = employee.employee_token;
  }

  const handleSubmit = (e) => {
    // Prevent the default behavior of the form
    e.preventDefault();
    // Handle client side validations
    let valid = true; // Flag
    // First name is required
    if (!employee_first_name) {
      setFirstNameRequired("First name is required");
      valid = false;
    } else {
      setFirstNameRequired("");
    }
    // Email is required
    if (!employee_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!employee_email.includes("@")) {
      setEmailError("Invalid email format");
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(employee_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }
    // Password has to be at least 6 characters long
    if (!employee_password || employee_password.length < 6) {
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
      employee_email,
      employee_first_name,
      employee_last_name,
      employee_phone,
      employee_password,
      active_employee,
      company_role_id,
    };
    // Pass the form data to the service
    const newEmployee = employeeService.createEmployee(
      formData,
      loggedInEmployeeToken
    );
    newEmployee
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setServerError(data.error);
        } else {
          setSuccess(true);
          setServerError("");

          setTimeout(() => {
            window.location.href = "/admin/employees";
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
    <section className="contact-section ">
      <div className="auto-container">
        <div className="flex items-center gap-3 mb-4">
          <h2 className="page-titles text-3xl font-bold mb-4">
            Add a new employee
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
                        name="employee_email"
                        value={employee_email}
                        onChange={(event) => setEmail(event.target.value)}
                        placeholder="Employee email"
                        className="form-control form-control-sm text-sm rounded-none px-3"
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
                        name="employee_first_name"
                        value={employee_first_name}
                        onChange={(event) => setFirstName(event.target.value)}
                        placeholder="Employee first name"
                        className="form-control form-control-sm py-2 rounded-none px-4"
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
                        name="employee_last_name"
                        value={employee_last_name}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Employee last name"
                        className="form-control form-control-sm  rounded-none px-4 "
                        required
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <input
                        type="text"
                        name="employee_phone"
                        value={employee_phone}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="Employee phone (555-555-5555)"
                        className="form-control form-control-sm py-2 rounded-none px-4"
                        required
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                    </div>

                    <div className="form-group col-md-12">
                      <select
                        name="employee_role"
                        value={company_role_id}
                        onChange={(event) =>
                          setCompany_role_id(event.target.value)
                        }
                        className="custom-select-box"
                        style={{ height: "40px", fontSize: "14px" }}
                      >
                        <option value="1">Employee</option>
                        <option value="2">Manager</option>
                        <option value="3">Admin</option>
                      </select>
                    </div>

                    <div className="form-group col-md-12 relative">
                      {" "}
                      {/* Add relative positioning */}
                      <input
                        type={showPassword ? "text" : "password"} 
                        name="employee_password"
                        value={employee_password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Employee password"
                        className="form-control form-control-sm py-2 rounded-none px-4"
                        style={{ height: "40px", fontSize: "14px" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)} // Toggle show/hide password
                        className="absolute right-6 top-1/2 transform -translate-y-1/2" // Position the icon
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}{" "}
                        {/* Conditional rendering */}
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
                        <span>Add employee</span>
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

export default AddEmployeeForm;