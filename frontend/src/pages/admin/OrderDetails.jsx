
// Import the AddCustomerorm component 
import OrderDetails from "../../Components/Admin/OrderDetails/OrderDetails"
// Import the AdminMenu component 
import AdminMenu from '../../Components/Admin/AdminMenu/AdminMenu';

function AddCustomer(props) {
    return (
        <div>
        <div className="container-fluid admin-pages">
            <div className="row">
            <div className="col-md-3 admin-left-side">
                <AdminMenu />
            </div>
            <div className="col-md-9 admin-right-side">
                <OrderDetails />
            </div>
            </div>
        </div>
        </div>
    );
}

export default AddCustomer;