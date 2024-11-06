// Import the EmployeeInfo component
import EmployeeInfo from "../Components/Employee/EmployeeProfile";
// Import the AdminMenu component
import AdminMenu from "../Components/Admin/AdminMenu/AdminMenu";
import { useAuth } from "../Contexts/AuthContext";

function EmployeeProfile(props) {
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
      <div className={`${isAdmin ? "w-7/10" : "w-full"} p-4`}>
        <EmployeeInfo />
      </div>
    </div>
  );
}

export default EmployeeProfile;
