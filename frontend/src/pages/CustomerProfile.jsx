
// Import the AddCustomerorm component 
import CustomerInfo from "../Components/customer/CustomerProfile";
// Import the AdminMenu component 
import AdminMenu from '../Components/Admin/AdminMenu/AdminMenu';

function CustomerProfile(props) {
    return (
        <div>
        <div className="container-fluid admin-pages">
            <div className="row">
            <div className="col-md-3 admin-left-side">
                <AdminMenu />
            </div>
            <div className="col-md-9 admin-right-side">
                <CustomerInfo/>
            </div>
            </div>
        </div>
        </div>
    );
}

export default CustomerProfile;