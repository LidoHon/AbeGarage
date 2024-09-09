
// Import the AddOrderForm component 
import AddOrderForm from "../../Components/Admin/AddOrderForm/AddOrderForm"
// Import the AdminMenu component 
import AdminMenu from '../../Components/Admin/AdminMenu/AdminMenu';

function AddOrder(props) {
    return (
        <div>
        <div className="container-fluid admin-pages">
            <div className="row">
            <div className="col-md-3 admin-left-side">
                <AdminMenu />
            </div>
            <div className="col-md-9 admin-right-side">
                <AddOrderForm />
            </div>
            </div>
        </div>
        </div>
    );
}

export default AddOrder;