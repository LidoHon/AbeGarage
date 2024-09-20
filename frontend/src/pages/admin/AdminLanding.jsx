import AdminMenu from '../../Components/Admin/AdminMenu/AdminMenu';
import AdminDashboard from '../../Components/Admin/dashboard/AdminDashboard';

const AdminLanding = () => {
    return (
        <div>
            <div className="container-fluid admin-pages">
                <div className="row">
                    <div className="col-md-3 admin-left-side">
                        <AdminMenu />
                    </div>
                    <div className="col-md-9 admin-right-side">
                        <AdminDashboard /> 
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLanding;
