
import AdminMenu from "../Components/Admin/AdminMenu/AdminMenu";
import CustomerInfo from "../Components/customer/CustomerProfile";
import { useAuth } from "../Contexts/AuthContext";


function CustomerProfile(props) {
    const { employee: authEmployee } = useAuth();

    const isAdmin = authEmployee && authEmployee.employee_role === 3;
    console.log(authEmployee?.employee_role);
  
  return (
    <div className="flex">
      {isAdmin && (
        <div className="col-md-3 admin-left-side">
          <AdminMenu />
        </div>
      )}

      <CustomerInfo />
    </div>
  );
}

export default CustomerProfile;
