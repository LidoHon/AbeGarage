import { useState, useEffect } from "react";
import customerService from "../../services/customer.service";
import { Button, Form, Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap CSS is imported

function UpdateCustomerForm({ customer, onClose, onSuccess }) {
    const [customer_email, setEmail] = useState("");
    const [customer_first_name, setFirstName] = useState("");
    const [customer_last_name, setLastName] = useState("");
    const [customer_phone, setPhoneNumber] = useState("");
    const [customer_password, setPassword] = useState("");
    const [active_customer, setActive_customer] = useState(1);
    const [emailError, setEmailError] = useState("");
    const [firstNameRequired, setFirstNameRequired] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [success, setSuccess] = useState(false);
    const [serverError, setServerError] = useState("");

useEffect(() => {
    if (customer) {
        setEmail(customer.customer_email);
        setFirstName(customer.customer_first_name);
        setLastName(customer.customer_last_name);
        setPhoneNumber(customer.customer_phone);
        setActive_customer(customer.active_customer);

    }
}, [customer]);

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
        valid = false;
        } else {
        const regex = /^\S+@\S+\.\S+$/;
        if (!regex.test(customer_email)) {
            setEmailError("Invalid email format");
            valid = false;
        } else {
            setEmailError("");
        }
    }

    if (!customer_password || customer_password.length < 6) {
        setPasswordError("Password must be at least 6 characters long");
        valid = false;
    } else {
        setPasswordError("");
    }

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

    customerService
        .updateCustomer(customer.customer_id, formData, customer.customer_token)
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
            value={customer_email}
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
            value={customer_first_name}
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
            value={customer_last_name}
            onChange={(event) => setLastName(event.target.value)}
            placeholder="Enter last name"
        />
        </Form.Group>

        <Form.Group controlId="formPhone">
        <Form.Label>Phone Number</Form.Label>
        <Form.Control
            type="text"
            value={customer_phone}
            onChange={(event) => setPhoneNumber(event.target.value)}
            placeholder="Enter phone number"
        />
        </Form.Group>

        <Form.Group controlId="formPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control
            type="password"
            value={customer_password}
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
            value={active_customer}
            onChange={(event) => setActive_customer(Number(event.target.value))}
        >
            <option value={1}>Yes</option>
            <option value={0}>No</option>
        </Form.Control>
        </Form.Group>

        <Button variant="primary" type="submit">
            Update Customer
        </Button>

        {serverError && (
            <Alert variant="danger" className="mt-3">
            {serverError}
            </Alert>
        )}
        {success && (
            <Alert variant="success" className="mt-3">
            Customer updated successfully
            </Alert>
        )}
    </Form>
    );
}

export default UpdateCustomerForm;
