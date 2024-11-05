import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import LoginForm from "../../Components/LoginForm/LoginForm";
import AdminMenu from "../../Components/Admin/AdminMenu/AdminMenu";
import EmployeesList from "../../Components/Admin/EmployeesList/EmployeesList";
import Unauthorized from "../Unauthorized";

function Employees() {
  const { isLogged, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);

  // Simulate a loading period to ensure auth state is properly checked
  useEffect(() => {
    if (isLogged !== undefined && isAdmin !== undefined) {
      setLoading(false);
    }
  }, [isLogged, isAdmin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (isLogged) {
    if (isAdmin) {
      return (
        <div>
          <div className="container-fluid admin-pages">
            <div className="row">
              <div className="col-md-3 admin-left-side">
                <AdminMenu />
              </div>
              <div className="col-md-9 admin-right-side">
                <EmployeesList />
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <Unauthorized />;
    }
  } else {
    return <LoginForm />;
  }
}

export default Employees;
