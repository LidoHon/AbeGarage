import { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import employeeService from "../../services/employee.service";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UpdateEmployeeForm = ({ onSuccess }) => {
  const { employee_id } = useParams(); 
  const navigate = useNavigate(); // Initialize useNavigate
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await employeeService.getEmployeeById(employee_id);
        const data = await response.json();
        if (data.status === "success" && data.data) {
          const employeeData = data.data;
          setEmail(employeeData.employee_email || "");
          setFirstName(employeeData.employee_first_name || "");
          setLastName(employeeData.employee_last_name || "");
          setPhoneNumber(employeeData.employee_phone || "");
          setActive_employee(employeeData.active_employee !== undefined ? employeeData.active_employee : 1);
          setCompany_role_id(employeeData.company_role_id || 1);
        } else {
          toast.error("No employee data found.");
        }
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load employee data");
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [employee_id]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;
    setEmailError("");
    setFirstNameRequired("");
    setPasswordError("");

    if (!employee_first_name) {
      setFirstNameRequired("First name is required");
      valid = false;
    }
    if (!employee_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!employee_email.includes("@")) {
      setEmailError("Invalid email format");
      valid = false;
    }
    if (employee_password && employee_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    }
    if (!valid) return;

    const formData = {
      employee_email,
      employee_first_name,
      employee_last_name,
      employee_phone,
      employee_password,
      active_employee,
      company_role_id,
    };

    employeeService
      .updateEmployee(employee_id, formData)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Employee updated successfully");

          // Redirect to employee list after successful update
          setTimeout(() => {
            navigate("/admin/employees"); // Navigate to employee list
          }, 2000); // Allow time to display the toast message
        }
      })
      .catch((error) => {
        toast.error("An error occurred. Please try again later.");
      });
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="flex items-center gap-4">
            <h2 className="page-titles text-3xl font-bold"> Edit: 
                {employee_first_name} {employee_last_name}
            </h2>
            <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
      </div>
      <p><strong>Employee email:</strong> {employee_email}</p>

      <Form onSubmit={handleSubmit} className="p-4 " style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Form.Group controlId="formEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={employee_email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Enter email"
            isInvalid={!!emailError}
          />
          <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formFirstName" className="mt-3">
          <Form.Label>First Name</Form.Label>
          <Form.Control
            type="text"
            value={employee_first_name}
            onChange={(event) => setFirstName(event.target.value)}
            placeholder="Enter first name"
            isInvalid={!!firstNameRequired}
          />
          <Form.Control.Feedback type="invalid">{firstNameRequired}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formLastName" className="mt-3">
          <Form.Label>Last Name</Form.Label>
          <Form.Control
            type="text"
            value={employee_last_name}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Enter last name"
          />
        </Form.Group>

        <Form.Group controlId="formPhone" className="mt-3">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            value={employee_phone}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="Enter phone number"
          />
        </Form.Group>

        <Form.Group controlId="formPassword" className="mt-3">
          <Form.Label>Password (optional)</Form.Label>
          <Form.Control
            type="password"
            value={employee_password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Enter new password (leave blank if not changing)"
            isInvalid={!!passwordError}
          />
          <Form.Control.Feedback type="invalid">{passwordError}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group controlId="formRole" className="mt-3">
          <Form.Label>Role</Form.Label>
          <Form.Control
            as="select"
            value={company_role_id}
            onChange={(event) => setCompany_role_id(Number(event.target.value))}
          >
            <option value={1}>Employee</option>
            <option value={2}>Manager</option>
            <option value={3}>Admin</option>
          </Form.Control>
        </Form.Group>
        <Form.Group controlId="formActive" className="mt-3">
          <Form.Check
            type="checkbox"
            label="Is active employee"
            checked={active_employee === 1}
            onChange={(event) => setActive_employee(event.target.checked ? 1 : 0)}
          />
        </Form.Group>
        <button  type="submit" className=" buttonStyle mt-4 w-36">
          UPDATE
        </button>
      </Form>
    </div>
  );
};

export default UpdateEmployeeForm;
