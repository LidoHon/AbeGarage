import React from "react";
import { Link } from "react-router-dom";

function AdminMenu(props) {
  return (
    <div>
      <div className="admin-menu">
        <h2>Admin Menu</h2>
      </div>
      <div className="items-center p-2 ">
        <Link to="/admin/admin-landing" className="list-group-item p-2">
          Dashboard
        </Link>
        <Link to="/admin/orders" className="list-group-item p-2">
          Orders
        </Link>
        <Link to="/admin/add-order" className="list-group-item p-2">
          New order
        </Link>
        <Link to="/admin/add-employee" className="list-group-item p-2">
          Add employee
        </Link>
        <Link to="/admin/employees" className="list-group-item p-2">
          Employees
        </Link>
        <Link to="/admin/add-customer" className="list-group-item p-2">
          Add customer
        </Link>
        <Link to="/admin/customers" className="list-group-item p-2">
          Customers
        </Link>
        <Link to="/admin/services" className="list-group-item p-2">
          Services
        </Link>
      </div>
    </div>
  );
}

export default AdminMenu;