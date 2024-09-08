import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import Home from "./Components/Home";
import Login from "./pages/Login";
import AddEmployee from "./pages/admin/AddEmployee";
import "./assets/styles/custom.css";
import Unauthorized from "./pages/Unauthorized";
import PrivateAuthRoute from "./Components/Auth/PrivateAuthRoute";
// import Customer from "./Components/customer/Customer";
import Orders from "./Components/order/Order";
import NotFound from "./pages/404";
import Employees from "./pages/admin/Employees";
import Customers from './pages/admin/Customers';
import Contact from "./pages/contactPage/Contact";
import AboutUs from "./pages/About";
import AdminLanding from "./pages/admin/AdminLanding";
import AddCustomer from "./pages/admin/AddCustomer";
import CustomerProfile from "./pages/CustomerProfile";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<AboutUs />} />
          <Route
            path="/admin/admin-landing"
            element={
              <PrivateAuthRoute roles={[2, 3]}>
                <AdminLanding />
              </PrivateAuthRoute>
            }
          />
          {/* <Route
            path="/admin/customer"
            element={
              <PrivateAuthRoute roles={[2, 3]}>
                <Customer />
              </PrivateAuthRoute>
            }
          /> */}
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
            path="/admin/customer-profile/:customer_id"
            element={
              <PrivateAuthRoute roles={[3, 1]}>
                <CustomerProfile />
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
