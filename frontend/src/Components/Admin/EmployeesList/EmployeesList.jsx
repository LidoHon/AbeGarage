import { useState, useEffect } from "react";
import { Table, Button, Pagination } from "react-bootstrap"; 
import { useAuth } from "../../../Contexts/AuthContext";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import employeeService from "../../services/employee.service";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const EmployeesList = () => {
  const [employees, setEmployees] = useState([]);
  const [apiError, setApiError] = useState(false);
  const [apiErrorMessage, setApiErrorMessage] = useState(null);
  const { employee } = useAuth();
  const token = employee?.employee_token || null;
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1); 
  const itemsPerPage = 4; 

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
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        const res = await employeeService.deleteEmployee(employeeId, token);
        if (!res.ok) {
          setApiError(true);
          setApiErrorMessage(getErrorMessage(res.status));
          return;
        }
        setEmployees(employees.filter((emp) => emp.employee_id !== employeeId));
      } catch (err) {
        setApiError(true);
        setApiErrorMessage("An error occurred. Please try again later.");
      }
    }
  };

  const handleNavigateToProfile = (employeeId) => {
    navigate(`/admin/employee-profile/${employeeId}`); // Navigate to the profile page
  };

  const handleEdit = (employeeId) => {
    navigate(`/admin/employee/${employeeId}`); // Navigate to the edit route
  };

  // Add a utility function to map role IDs to role names
  const getRoleName = (roleId) => {
    switch (roleId) {
      case 1:
        return "Employee";
      case 2:
        return "Manager";
      case 3:
        return "Admin";
      default:
        return "Unknown";
    }
  };

  // Pagination Logic
  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="employees-list px-8 text-sm min-h-[500px]">
      {apiError ? (
        <section className="error-section">
          <div className="container">
            <h2>{apiErrorMessage}</h2>
          </div>
        </section>
      ) : (
        <section className="table-section">
          <div className="container">
            <div className="flex items-center gap-4">
              <h2 className="page-titles text-3xl font-bold mb-4 mt-4">Employees</h2>
              <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
            </div>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Active</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Added Date</th>
                  <th>Role</th>
                  <th>Edit/Delete</th>
                </tr>
              </thead>
              <tbody>
                {currentEmployees.map((employee) => (
                  <tr key={employee.employee_id} onClick={() => handleNavigateToProfile(employee.employee_id)} style={{ cursor: "pointer" }}>
                    <td>{employee.employee_id}</td>
                    <td>{employee.active_employee ? "Yes" : "No"}</td>
                    <td>{employee.employee_first_name}</td>
                    <td>{employee.employee_last_name}</td>
                    <td>{employee.employee_email}</td>
                    <td>{employee.employee_phone}</td>
                    <td>{format(new Date(employee.added_date), "MM/dd/yyyy | HH:mm")}</td>
                    <td>{employee.company_role_id ? getRoleName(employee.company_role_id) : "Unknown"}</td>
                    <td>
                      <div className="d-flex align-items-center">
                        <FaEdit
                          className="me-2 text-gray-800"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from triggering
                            handleEdit(employee.employee_id);
                          }}
                        />
                        <FaTrashAlt
                          className="text-gray-800"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click from triggering
                            handleDelete(employee.employee_id);
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            {/* Pagination */}
            {employees.length > itemsPerPage && (
              <Pagination className="custom-pagination justify-content-center">
                <Pagination.First
                  onClick={() => paginate(1)}
                  disabled={currentPage === 1}
                >
                  « First
                </Pagination.First>
                <Pagination.Prev
                  onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
                  disabled={currentPage === 1}
                >
                  ‹ Previous
                </Pagination.Prev>
                <Pagination.Next
                  onClick={() =>
                    paginate(currentPage < totalPages ? currentPage + 1 : currentPage)
                  }
                  disabled={currentPage === totalPages}
                >
                  Next ›
                </Pagination.Next>
                <Pagination.Last
                  onClick={() => paginate(totalPages)}
                  disabled={currentPage === totalPages}
                >
                  Last »
                </Pagination.Last>
              </Pagination>
            )}
          </div>
        </section>
      )}
    </div>
  );
};

export default EmployeesList;
