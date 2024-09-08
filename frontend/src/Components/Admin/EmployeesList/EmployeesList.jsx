import React, { useState, useEffect } from "react";
import { Table, Modal, Button } from "react-bootstrap";
import { Popconfirm } from "antd";
import { useAuth } from "../../../Contexts/AuthContext";
import { format } from "date-fns";
import employeeService from "../../services/employee.service";
import UpdateEmployeeForm from "./UpdateEmployeeForm"; // Import the UpdateEmployeeForm

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleDelete = async (employeeId) => {
    try {
      const res = await employeeService.deleteEmployee(employeeId, token);
      if (!res.ok) {
        setApiError(true);
        setApiErrorMessage(getErrorMessage(res.status));
        return;
      }
      // Refresh the employee list after deletion
      setEmployees(employees.filter((emp) => emp.employee_id !== employeeId));
    } catch (err) {
      setApiError(true);
      setApiErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
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
                    <td>
                      {format(
                        new Date(employee.added_date),
                        "MM/dd/yyyy | HH:mm"
                      )}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Button
                          variant="primary"
                          onClick={() => handleEdit(employee)}
                        >
                          Edit
                        </Button>
                        <Popconfirm
                          title="Are you sure you want to delete this employee?"
                          onConfirm={() => handleDelete(employee.employee_id)}
                          okText="Yes"
                          cancelText="No"
                        >
                          <Button variant="danger">Delete</Button>
                        </Popconfirm>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </section>
      )}

      {/* Bootstrap Modal for Editing Employee */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Employee</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedEmployee && (
            <UpdateEmployeeForm
              employee={selectedEmployee}
              onClose={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false);
                // Refresh employee list or handle success
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default EmployeesList;
