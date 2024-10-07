import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./Components/Home";
import Login from "./pages/Login";
import AddEmployee from "./pages/admin/AddEmployee";
import "./assets/styles/custom.css";
import Unauthorized from "./pages/Unauthorized";
import PrivateAuthRoute from "./Components/Auth/PrivateAuthRoute";
// import Customer from "./Components/customer/Customer";
import NotFound from "./pages/404";
import Employees from "./pages/admin/Employees";
import EditEmployee from './pages/admin/EditEmployee'
import EmployeeProfile from "./pages/EmployeeProfile"
import Customers from './pages/admin/Customers';
import EditCustomer from './pages/admin/EditCustomer';
import Contact from "./pages/contactPage/Contact";
import AboutUs from "./pages/About";
import HomeService from "./pages/Services"
import AdminLanding from "./pages/admin/AdminLanding";
import AddCustomer from "./pages/admin/AddCustomer";
import CustomerProfile from "./pages/CustomerProfile";
import AddOrder from "./pages/admin/AddOrder";
import Orders from "./pages/admin/Orders"
import OrderDetails from "./pages/admin/OrderDetails"
import Services from "./pages/admin/Services";
import EditOrderForm from "./Components/Admin/EditOrderForm/EditOrderForm";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/services" element={<HomeService />} />
          <Route
            path="/admin/admin-landing"
            element={
              <PrivateAuthRoute roles={[2, 3]}>
                <AdminLanding />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateAuthRoute roles={[1, 2, 3]}>
                <Orders />
              </PrivateAuthRoute>
            }
          />
          <Route path="/unauthorized" element={<Unauthorized />} />
          {/* <Route path="/admin/add-employee" element={<AddEmployee />} /> */}
          <Route
            path="/admin/add-employee"
            element={
              <PrivateAuthRoute roles={[3]}>
                <AddEmployee />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <PrivateAuthRoute roles={[3, 2]}>
                <Employees />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/employee/:employee_id"
            element={
              <PrivateAuthRoute roles={[3, 2]}>
                <EditEmployee />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/employee-profile/:employee_id"
            element={
              <PrivateAuthRoute roles={[3, 1]}>
                <EmployeeProfile/>
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/order/:orderId"
            element={
              <PrivateAuthRoute roles={[3]}>
                <OrderDetails/>
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/add-customer"
            element={
              <PrivateAuthRoute roles={[3]}>
                <AddCustomer />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <PrivateAuthRoute roles={[3, 1]}>
                <Customers />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/customer/:customer_id"
            element={
              <PrivateAuthRoute roles={[3, 2]}>
                <EditCustomer />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/customer-profile/:customer_id"
            element={
              <PrivateAuthRoute roles={[3]}>
                <CustomerProfile />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/add-order"
            element={
              <PrivateAuthRoute roles={[3]}>
                <AddOrder />
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <PrivateAuthRoute roles={[3]}>
                <Orders/>
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/edit-order/:orderId"
            element={
              <PrivateAuthRoute roles={[3]}>
                <EditOrderForm/>
              </PrivateAuthRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <PrivateAuthRoute roles={[3, 1]}>
                <Services />
              </PrivateAuthRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
