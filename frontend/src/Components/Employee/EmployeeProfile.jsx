import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import employeeService from "../../Components/services/employee.service";
import { useAuth } from "../../Contexts/AuthContext";
import { Spinner, Container, Card } from "react-bootstrap"; 

const EmployeeProfile = () => {
    const { employee_id } = useParams(); 
    const { employee: authEmployee } = useAuth();
    const [employee, setEmployee] = useState(null); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = authEmployee?.employee_token || null;

    useEffect(() => {
        const fetchEmployeeDetails = async () => {
        try {
            setLoading(true);
            const response = await employeeService.getEmployeeById(employee_id, token);
            if (!response.ok) {
            setError("Unable to fetch employee details. Please try again.");
            return;
            }
            const data = await response.json();
            setEmployee(data.data);
        } catch (err) {
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
        };

        fetchEmployeeDetails();
    }, [employee_id, token]);

    if (loading) {
        return (
        <Container className="d-flex justify-content-center mt-5">
            <Spinner animation="border" />
        </Container>
        );
    }

    if (error) {
        return (
        <Container className="mt-5">
            <h3 className="text-danger">{error}</h3>
        </Container>
        );
    }

    if (!employee) {
        return (
        <Container className="mt-5">
            <h3 className="text-warning">Employee not found</h3>
        </Container>
        );
    }

    return (
        <Container className="mt-5">
        <Card className="shadow">
            <Card.Header as="h2">{`${employee.employee_first_name} ${employee.employee_last_name}`}</Card.Header>
            <Card.Body>
            <div className="mb-3">
                <strong>Email: </strong> {employee.employee_email}
            </div>
            <div className="mb-3">
                <strong>Phone: </strong> {employee.employee_phone}
            </div>
            <div className="mb-3">
                <strong>Active Employee: </strong> {employee.active_employee ? "Yes" : "No"}
            </div>
            <div className="mb-3">
                <strong>Added Date: </strong> {new Date(employee.added_date).toLocaleString()}
            </div>
            </Card.Body>
        </Card>
        </Container>
    );
};

export default EmployeeProfile;
