import { useState, useEffect } from "react";
import customerService from "../../services/customer.service";
import { Button, Form, Spinner } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UpdateCustomerForm() {
    const { customer_id } = useParams(); // Fetch customer ID from route params
    const navigate = useNavigate(); // Initialize useNavigate for redirection
    const [customer_email, setEmail] = useState("");
    const [customer_first_name, setFirstName] = useState("");
    const [customer_last_name, setLastName] = useState("");
    const [customer_phone, setPhoneNumber] = useState("");
    const [customer_password, setPassword] = useState("");
    const [active_customer, setActive_customer] = useState(1);
    const [emailError, setEmailError] = useState("");
    const [firstNameRequired, setFirstNameRequired] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomerDetails = async () => {
            try {
                const response = await customerService.getCustomer(customer_id);
                const data = await response.json();

                if (data.status === "success") {
                    const customerData = data.data;
                    setEmail(customerData.customer_email);
                    setFirstName(customerData.customer_first_name);
                    setLastName(customerData.customer_last_name);
                    setPhoneNumber(customerData.customer_phone);
                    setActive_customer(customerData.active_customer);
                } else {
                    toast.error("Failed to fetch customer details");
                }
            } catch (error) {
                toast.error("Error fetching customer details");
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchCustomerDetails();
    }, [customer_id]);

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
            setEmailError("");
        }

        if (customer_password && customer_password.length < 6) {
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
            .updateCustomer(customer_id, formData)
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    toast.error(data.error);
                } else {
                    toast.success("Customer updated successfully");

                    // Delay for 2 seconds before navigating to the customers page
                    setTimeout(() => {
                        navigate("/admin/customers");
                    }, 2000); // Adjust the delay as necessary
                }
            })
            .catch((error) => {
                const resMessage = error.message || "An error occurred.";
                toast.error(resMessage);
            });
    };

    if (loading) {
        return <Spinner animation="border" />;
    }

    return (
        <div className="container py-5">
            <ToastContainer /> {/* Toast container for displaying toast messages */}
            <div className="flex items-center gap-4">
                <h2 className="page-titles text-3xl font-bold">
                    Edit: {customer_first_name} {customer_last_name}
                </h2>
                <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
            </div>
            <p><strong>Customer email:</strong> {customer_email}</p>

            <Form onSubmit={handleSubmit} className="p-4" style={{ maxWidth: "600px", margin: "0 auto" }}>
                {/* Email */}
                <Form.Group controlId="formEmail" className="mt-3">
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

                {/* First Name */}
                <Form.Group controlId="formFirstName" className="mt-3">
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

                {/* Last Name */}
                <Form.Group controlId="formLastName" className="mt-3">
                    <Form.Control
                        type="text"
                        value={customer_last_name}
                        onChange={(event) => setLastName(event.target.value)}
                        placeholder="Enter last name"
                    />
                </Form.Group>

                {/* Phone Number */}
                <Form.Group controlId="formPhone" className="mt-3">
                    <Form.Control
                        type="text"
                        value={customer_phone}
                        onChange={(event) => setPhoneNumber(event.target.value)}
                        placeholder="Enter phone number"
                    />
                </Form.Group>

                {/* Password */}
                <Form.Group controlId="formPassword" className="mt-3">
                    <Form.Label>Password (optional)</Form.Label>
                    <Form.Control
                        type="password"
                        value={customer_password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Enter password (leave blank if not changing)"
                        isInvalid={!!passwordError}
                    />
                    <Form.Control.Feedback type="invalid">
                        {passwordError}
                    </Form.Control.Feedback>
                </Form.Group>

                {/* Active Customer */}
                <Form.Group controlId="formActive" className="mt-3">
                    <Form.Check
                        type="checkbox"
                        label="Is active customer"
                        checked={active_customer === 1}
                        onChange={(event) => setActive_customer(event.target.checked ? 1 : 0)}
                    />
                </Form.Group>

                <button type="submit" className="buttonStyle mt-4 w-36">
                    UPDATE
                </button>
            </Form>
        </div>
    );
}

export default UpdateCustomerForm;
