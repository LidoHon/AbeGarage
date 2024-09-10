import { useState, useEffect } from "react";
import employeeService from "../../services/employee.service";
import { Button, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

function UpdateEmployeeForm({ employee, onClose, onSuccess }) {
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

  useEffect(() => {
    if (employee) {
      setEmail(employee.employee_email);
      setFirstName(employee.employee_first_name);
      setLastName(employee.employee_last_name);
      setPhoneNumber(employee.employee_phone);
      setActive_employee(employee.active_employee);
      setCompany_role_id(employee.company_role_id);
    }
  }, [employee]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!employee_first_name) {
      setFirstNameRequired("First name is required");
      valid = false;
    } else {
      setFirstNameRequired("");
    }

    if (!employee_email) {
      setEmailError("Email is required");
      valid = false;
    } else if (!employee_email.includes("@")) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(employee_email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    if (!employee_password || employee_password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

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

    employeeService
      .updateEmployee(employee.employee_id, formData, employee.employee_token)
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setServerError(data.error);
        } else {
          setSuccess(true);
          setServerError("");
          onSuccess();
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
    <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
      <Form.Group controlId="formEmail">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          value={employee_email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Enter email"
          isInvalid={!!emailError}
        />
        <Form.Control.Feedback type="invalid">
          {emailError}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formFirstName">
        <Form.Label>First Name</Form.Label>
        <Form.Control
          type="text"
          value={employee_first_name}
          onChange={(event) => setFirstName(event.target.value)}
          placeholder="Enter first name"
          isInvalid={!!firstNameRequired}
        />
        <Form.Control.Feedback type="invalid">
          {firstNameRequired}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formLastName">
        <Form.Label>Last Name</Form.Label>
        <Form.Control
          type="text"
          value={employee_last_name}
          onChange={(event) => setLastName(event.target.value)}
          placeholder="Enter last name"
        />
      </Form.Group>

      <Form.Group controlId="formPhone">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
          type="text"
          value={employee_phone}
          onChange={(event) => setPhoneNumber(event.target.value)}
          placeholder="Enter phone number"
        />
      </Form.Group>

      <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          value={employee_password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Enter password"
          isInvalid={!!passwordError}
        />
        <Form.Control.Feedback type="invalid">
          {passwordError}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId="formActive">
        <Form.Label>Active</Form.Label>
        <Form.Control
          as="select"
          value={active_employee}
          onChange={(event) => setActive_employee(Number(event.target.value))}
        >
          <option value={1}>Yes</option>
          <option value={0}>No</option>
        </Form.Control>
      </Form.Group>

      <Form.Group controlId="formRole">
        <Form.Label>Role</Form.Label>
        <Form.Control
          as="select"
          value={company_role_id}
          onChange={(event) => setCompany_role_id(Number(event.target.value))}
        >
          <option value={1}>Employee</option>
          <option value={1}>Manager</option>
          <option value={1}>Admin</option>
        </Form.Control>
      </Form.Group>

      <Button variant="primary" type="submit">
        Update Employee
      </Button>

      {serverError && (
        <Alert variant="danger" className="mt-3">
          {serverError}
        </Alert>
      )}
      {success && (
        <Alert variant="success" className="mt-3">
          Employee updated successfully
        </Alert>
      )}
    </Form>
  );
}

export default UpdateEmployeeForm;
