
// Import the AddCustomerorm component 
import EmployeeInfo from "../Components/Employee/EmployeeProfile";
// Import the AdminMenu component 
import AdminMenu from '../Components/Admin/AdminMenu/AdminMenu';

function EmployeeProfile(props) {
    return (
        <div>
        <div className="container-fluid admin-pages">
            <div className="row">
            <div className="col-md-3 admin-left-side">
                <AdminMenu />
            </div>
            <div className="col-md-9 admin-right-side">
                <EmployeeInfo/>
            </div>
            </div>
        </div>
        </div>
    );
}

export default EmployeeProfile;