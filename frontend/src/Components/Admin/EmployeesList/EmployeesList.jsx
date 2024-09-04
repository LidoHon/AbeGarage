// Import the necessary components 
import { useState, useEffect } from "react";
import { Table } from 'react-bootstrap';
import { useAuth } from "../../../Contexts/AuthContext";
import { format } from 'date-fns';
import employeeService from "../../services/employee.service";

// Create the EmployeesList component 
const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const { employee } = useAuth();
  const token = employee?.employee_token || null;

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await employeeService.getAllEmployees(token);
        if (!res.ok) {
          setApiError(true);
          setApiErrorMessage(getErrorMessage(res.status));
          return;
        }
        const data = await res.json();
        if (data.data.length !== 0) {
          setEmployees(data.data);
        }
      } catch (err) {
        setApiError(true);
        setApiErrorMessage("An error occurred. Please try again later.");
      }
    };
    fetchEmployees();
  }, [token]);

  const getErrorMessage = (status) => {
    switch (status) {
      case 401:
        return "Please login again.";
      case 403:
        return "You are not authorized to view this page.";
      default:
        return "Please try again later.";
    }
  };

  return (
    <div className="employees-list">
      {apiError ? (
        <section className="error-section">
          <div className="container">
            <h2>{apiErrorMessage}</h2>
          </div>
        </section>
      ) : (
        <section className="table-section">
          <div className="container">
            <h2>Employees</h2>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Active</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added Date</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((employee) => (
                  <tr key={employee.employee_id}>
                    <td>{employee.active_employee ? "Yes" : "No"}</td>
                    <td>{employee.employee_first_name}</td>
                    <td>{employee.employee_last_name}</td>
                    <td>{employee.employee_email}</td>
                    <td>{employee.employee_phone}</td>
                    <td>{format(new Date(employee.added_date), 'MM/dd/yyyy | HH:mm')}</td>
                    <td>{employee.company_role_name}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}
    </div>
  );
};

// Export the EmployeesList component 
export default EmployeesList;
