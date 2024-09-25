
// Import the AddCustomerorm component 
import OrderList from "../../Components/Admin/OrderList/OrderList"
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
                <OrderList />
            </div>
            </div>
        </div>
        </div>
    );
}

export default AddCustomer;