import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import employeeService from "../../Components/services/employee.service";
import { Row, Col } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { FaEllipsisV } from "react-icons/fa";
import CompletedTasks from "./CompletedTasks";

const EmployeeProfile = () => {
  const localStorageEmployee =
    JSON.parse(localStorage.getItem("employee")) || {};
  const employee_role = localStorageEmployee?.employee_role;
  const localEmployeeId = localStorageEmployee?.employee_id;
  const { employee_id: paramEmployeeId } = useParams();
  const employee_id = employee_role === 1 ? localEmployeeId : paramEmployeeId;

  const [openOrder, setOpenOrder] = useState({});
  const [employee, setEmployee] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorageEmployee?.employee_token || "";
  const [selectedStatus, setSelectedStatus] = useState({});
  const [isEditingStatus, setIsEditingStatus] = useState({});
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        setLoading(true);
        const response = await employeeService.getEmployeeById(
          employee_id,
          token
        );
        const employeeData = await response.json();

        if (employeeData.status !== "success" || !employeeData.data) {
          setError("Employee not found.");
          return;
        }

        setEmployee(employeeData.data);
      } catch (err) {
        console.error("Error occurred fetching employee details:", err);
        setError("An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    const fetchAssignedTasks = async () => {
      try {
        const tasksResponse = await employeeService.getEmployeeTasks(
          employee_id,
          token
        );
        setTasks(tasksResponse);
      } catch (err) {
        console.error("An error occurred fetching tasks:", err);
        setError("Failed to load assigned tasks.");
      }
    };

    if (employee_id) {
      fetchEmployeeDetails();
      fetchAssignedTasks();
    } else {
      setError("No employee ID found.");
      setLoading(false);
    }
  }, [employee_id, token, paramEmployeeId]);

  const handleStatusChange = (orderServiceId, newStatus) => {
    setSelectedStatus((prevStatus) => ({
      ...prevStatus,
      [orderServiceId]: newStatus,
    }));
    setIsEditingStatus((prev) => ({
      ...prev,
      [orderServiceId]: true,
    }));
  };

  const handleSaveStatus = async (orderServiceId) => {
    const updatedStatus = selectedStatus[orderServiceId];

    try {
      const responseData = await employeeService.updateTaskStatus(
        orderServiceId,
        updatedStatus,
        token
      );
      console.log("API Response Data in handleSaveStatus:", responseData);

      if (responseData && responseData.success === true) {
        // Update the tasks array by creating a new array
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.order_service_id === orderServiceId
              ? { ...task, order_status: parseInt(updatedStatus) }
              : task
          )
        );

        setIsEditingStatus((prev) => ({
          ...prev,
          [orderServiceId]: false,
        }));
      } else {
        console.error(
          `Failed to update status for Order Service ID: ${orderServiceId}`
        );
      }
    } catch (err) {
      console.error(
        `Error updating status for Order Service ID: ${orderServiceId}`,
        err
      );
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 1:
        return <span className="badge bg-secondary">Received</span>;
      case 2:
        return <span className="badge bg-warning text-dark">In progress</span>;
      case 3:
        return <span className="badge bg-success">Completed</span>;
      default:
        return <span className="badge bg-dark">Unknown</span>;
    }
  };

  const toggleOrderDetails = (order_id) => {
    setOpenOrder((prevState) => ({
      ...prevState,
      [order_id]: !prevState[order_id],
    }));
  };

  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  const getOrderStatusBadge = (order) => {
    const dueDate = new Date(order.services[0].estimated_completion_date);
    const currentDate = new Date();
    const allTasksCompleted = order.services.every(
      (service) => service.order_status === 3
    );
    const anyIncompleteTasks = order.services.some(
      (service) => service.order_status !== 3
    );

    if (allTasksCompleted) {
      return (
        <span className="text-xs bg-green-500 text-white font-semibold px-3 py-1 rounded">
          Completed
        </span>
      );
    } else if (anyIncompleteTasks && dueDate > currentDate) {
      return (
        <span className="text-xs bg-gray-400 text-white font-semibold px-3 py-1 rounded">
          To Be Completed
        </span>
      );
    } else if (anyIncompleteTasks && dueDate < currentDate) {
      return (
        <span className="text-xs bg-red-500 text-white font-semibold px-3 py-1 rounded">
          Not Completed
        </span>
      );
    } else if (!anyIncompleteTasks && dueDate < currentDate) {
      return (
        <span className="text-xs bg-purple-500 text-white font-semibold px-3 py-1 rounded">
          Completed Late
        </span>
      );
    }
  };

  const orders = tasks.reduce((acc, task) => {
    const { order_id } = task;

    if (!acc[order_id]) {
      acc[order_id] = {
        customer: {
          customer_first_name: task.customer_first_name,
          customer_last_name: task.customer_last_name,
          customer_email: task.customer_email,
          customer_phone: task.customer_phone,
        },
        vehicle: {
          vehicle_make: task.vehicle_make,
          vehicle_model: task.vehicle_model,
          vehicle_year: task.vehicle_year,
          vehicle_mileage: task.vehicle_mileage,
          vehicle_tag: task.vehicle_tag,
        },
        services: [],
      };
    }

    acc[order_id].services.push(task);

    return acc;
  }, {});

  const completedOrders = Object.keys(orders).filter((order_id) =>
    orders[order_id].services.some((service) => service.order_status === 3)
  );

  const visibleOrders = showMore
    ? completedOrders
    : completedOrders.slice(0, 2);

  return (
    <section className="services-section">
      <div className="px-32">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-4">
            <h2 className="text-uppercase page-titles text-3xl font-bold">
              {employee
                ? `${employee.employee_first_name} ${employee.employee_last_name}`
                : "Loading..."}
            </h2>
            <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
          </div>
        </div>
        <p className="text-gray-600 mb-6">
          You can manage your assigned tasks on this page. As you work through
          your tasks, update the status to reflect the progress. Change the task
          status from 'Received' to 'In Progress' or 'Completed' as you complete
          each service. This will help keep the team informed and ensure all
          tasks are up to date. Once a task is marked 'Completed', it will be
          highlighted to indicate that it's finished.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mx-20 service-block-one">
          <div className="inner-box hvr-float-shadow w-full md:w-1/2">
            <h5 className="font-semibold">Employee</h5>
            <div className="ml-4">
              {employee && (
                <>
                  <p className="font-bold">
                    {employee.employee_first_name} {employee.employee_last_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {employee.employee_email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {employee.employee_phone}
                  </p>
                  <p>
                    Active Employee:{" "}
                    <span
                      className={
                        employee.active_employee
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {employee.active_employee ? "Yes" : "No"}
                    </span>
                  </p>
                  <p>
                    <strong>Starting From:</strong>{" "}
                    {new Date(employee.added_date).toLocaleString()}
                  </p>
                </>
              )}
            </div>
          </div>

          {/* Completed tasks section */}
          {/* <CompletedTasks/> */}
          <div className="inner-box hvr-float-shadow w-full md:w-1/2">
            <h5 className="font-semibold">Completed Tasks</h5>
            <div className="ml-4">
              {/* Grouping tasks by order_id */}
              {visibleOrders.map((order_id) => (
                <div key={order_id} className="mb-4">
                  {/* Display order vehicle and customer info once */}
                  <div className="flex justify-between">
                    <div>
                      <p>
                        <strong className="page-titles">Order ID:</strong>{" "}
                        {order_id}{" "}
                        <strong className="page-titles">Vehicle:</strong>{" "}
                        {orders[order_id].vehicle.vehicle_make}{" "}
                        {orders[order_id].vehicle.vehicle_model}
                      </p>
                    </div>
                  </div>

                  {/* Display completed tasks under the order */}
                  {orders[order_id].services
                    .filter((service) => service.order_status === 3)
                    .map((service) => (
                      <div key={service.order_service_id} className="ml-4">
                        <div className="flex">
                          <p className="text-[14px] ml-2">
                            <strong className="page-titles">Task:</strong>{" "}
                            {service.service_name}
                          </p>
                          <div className="ml-4">
                            <span className="badge bg-success">Completed</span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ))}

              {/* Show more/Show less button */}
              {completedOrders.length > 2 && (
                <div className="mt-4">
                  <button
                    className="text-red-600 font-semibold flex items-center"
                    onClick={toggleShowMore}
                  >
                    {showMore ? "Show Less" : "Show More"}
                    {showMore ? (
                      <FaChevronUp className="ml-2" />
                    ) : (
                      <FaChevronDown className="ml-2" />
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white mx-20 p-10 border-b-2 border-red-500">
          <div className="flex items-center gap-4 mb-4">
            <h2 className="page-titles text-2xl font-bold">All tasks</h2>
          </div>
          <Row>
            {Object.keys(orders)
              .sort((a, b) => b - a)
              .map((order_id) => (
                <Col key={order_id} md={12} className="mb-4">
                  <div className="p-6 mb-2 rounded-md shadow-sm">
                    {/* Order ID, Due Date, Vehicle Details, and Toggle Button */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h5 className="text-lg font-semibold page-titles">
                          Order ID: #{order_id}
                        </h5>
                        {!openOrder[order_id] && (
                          <div className="flex text-sm text-gray-700">
                            {orders[order_id].vehicle.vehicle_make}{" "}
                            {orders[order_id].vehicle.vehicle_model}
                          </div>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="flex">
                          <span className="text-xs bg-yellow-300 text-black font-semibold px-3 py-1 rounded">
                            Due:{" "}
                            {orders[order_id].services[0]
                              .estimated_completion_date
                              ? new Date(
                                  orders[
                                    order_id
                                  ].services[0].estimated_completion_date
                                ).toLocaleDateString()
                              : "N/A"}
                          </span>
                          <button
                            onClick={() => toggleOrderDetails(order_id)}
                            className="focus:outline-none"
                          >
                            {openOrder[order_id] ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                        </div>
                        {!openOrder[order_id] && (
                          <div className="text-[8px] mt-2">
                            {getOrderStatusBadge(orders[order_id])}
                          </div>
                        )}
                      </div>
                    </div>

                    {openOrder[order_id] && (
                      <div className="mt-4">
                        <div className="grid grid-cols-2 gap-8 mt-4">
                          <div>
                            <h6 className="text-gray-600 font-bold mb-2">
                              Customer
                            </h6>
                            <p className="text-sm text-gray-700">
                              {orders[order_id].customer.customer_first_name}{" "}
                              {orders[order_id].customer.customer_last_name}
                            </p>
                            <p className="text-sm">
                              <strong>Email:</strong>{" "}
                              {orders[order_id].customer.customer_email}
                            </p>
                            <p className="text-sm">
                              <strong>Phone:</strong>{" "}
                              {orders[order_id].customer.customer_phone}
                            </p>
                          </div>
                          <div>
                            <h6 className="text-gray-600 font-bold mb-2">
                              Vehicle
                            </h6>
                            <p className="text-sm">
                              <strong>Model:</strong>{" "}
                              {orders[order_id].vehicle.vehicle_make}{" "}
                              {orders[order_id].vehicle.vehicle_model}
                            </p>
                            <p className="text-sm">
                              <strong>Year:</strong>{" "}
                              {orders[order_id].vehicle.vehicle_year}
                            </p>
                            <p className="text-sm">
                              <strong>Tag:</strong>{" "}
                              {orders[order_id].vehicle.vehicle_tag}
                            </p>
                          </div>
                        </div>

                        <h5 className="mt-4 mb-2 font-semibold text-gray-700">
                          Requested Services
                        </h5>
                        {orders[order_id].services.map((service) => (
                          <div
                            key={`${order_id}-${service.order_service_id}`}
                            className="py-2 border-b last:border-none"
                          >
                            <div className="flex justify-between items-center">
                              <div className="text-sm font-medium text-gray-700">
                                {service.service_name}
                              </div>
                              <div className="flex items-center">
                                <span className="mr-2">
                                  {getStatusBadge(service.order_status)}
                                </span>
                                {service.order_status !== 3 &&
                                  employee_role === 1 && (
                                    <div className="flex items-center">
                                      {!isEditingStatus[
                                        service.order_service_id
                                      ] ? (
                                        <div
                                          className="cursor-pointer"
                                          onClick={() =>
                                            setIsEditingStatus((prev) => ({
                                              ...prev,
                                              [service.order_service_id]: true,
                                            }))
                                          }
                                        >
                                          <FaEllipsisV />
                                        </div>
                                      ) : (
                                        <>
                                          <select
                                            value={
                                              selectedStatus[
                                                service.order_service_id
                                              ] || service.order_status
                                            }
                                            onChange={(e) =>
                                              handleStatusChange(
                                                service.order_service_id,
                                                e.target.value
                                              )
                                            }
                                            className="ml-2 p-1 border rounded-md"
                                          >
                                            <option value={1}>Received</option>
                                            <option value={2}>
                                              In progress
                                            </option>
                                            <option value={3}>Completed</option>
                                          </select>
                                          <button
                                            className="ml-2 px-3 py-1 bg-green-500 text-white rounded-md"
                                            onClick={() =>
                                              handleSaveStatus(
                                                service.order_service_id
                                              )
                                            }
                                          >
                                            Save
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </Col>
              ))}
          </Row>
        </div>
      </div>
    </section>
  );
};

export default EmployeeProfile;
