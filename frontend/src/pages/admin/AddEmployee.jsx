
// Import the AddEmployeeForm component 
import AddEmployeeForm from "../../Components/Admin/AddEmployeeForm/AddEmployeeForm"
// Import the AdminMenu component 
import AdminMenu from '../../Components/Admin/AdminMenu/AdminMenu';

function AddEmployee(props) {
  return (
    <div>
      <div className="container-fluid admin-pages">
        <div className="row">
          <div className="col-md-3 admin-left-side">
            <AdminMenu />
          </div>
          <div className="col-md-9 px-14">
            <AddEmployeeForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddEmployee;