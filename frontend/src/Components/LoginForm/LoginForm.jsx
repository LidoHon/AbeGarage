import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/login.service";
import { useAuth } from "../../Contexts/AuthContext";

function LoginForm() {
  const { setIsLogged, setEmployee, setCustomer } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isEmployeeLogin, setIsEmployeeLogin] = useState(true); 

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Client-side validations
    let valid = true;
    if (!email) {
      setEmailError("Please enter your email address");
      valid = false;
    } else if (!email.includes("@")) {
      setEmailError("Invalid email format");
      valid = false;
    } else {
      const regex = /^\S+@\S+\.\S+$/;
      if (!regex.test(email)) {
        setEmailError("Invalid email format");
        valid = false;
      } else {
        setEmailError("");
      }
    }

    if (!password || password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (!valid) return;

    const formData = { email, password };
    console.log("Form Data Submitted:", formData);

    try {
      // Call the appropriate service and return parsed data directly
      const response = isEmployeeLogin
        ? await loginService.logInEmployee(formData)
        : await loginService.logInCustomer(formData);

      console.log("Response from Server:", response);

      if (response.status === "success") {
        if (isEmployeeLogin) {
        // Clear previous customer data and store new employee data
        localStorage.removeItem("customer");
        const employeeData = {
          employee_token: response.data.employee_token,
          employee_role: response.data.employee_role,
          employee_first_name: response.data.employee_first_name,
          employee_id: response.data.employee_id,
        };
        localStorage.setItem("employee", JSON.stringify(employeeData));
        setEmployee(employeeData);
      } else {
        // Clear previous employee data and store new customer data
        localStorage.removeItem("employee");
        const customerData = {
          customer_token: response.data.customer_token,
          customer_first_name: response.data.customer_first_name,
          customer_id: response.data.customer_id, 
        };
        localStorage.setItem("customer", JSON.stringify(customerData));
        setCustomer(customerData);
      }

      setIsLogged(true);
      navigate(isEmployeeLogin ? "/" : "/");
    } else {
      setServerError(response.message);
    }
  } catch (err) {
    console.error("Error:", err);
    setServerError("An error has occurred. Please try again later.");
  }
};

return (
  <section className="min-h-fit flex items-center ml-48 mt-10 mb-24">
    <div className="p-8 max-w-lg w-full ">
      <div className="flex items-center gap-4">
          <h2 className="page-titles text-3xl font-bold mb-4 mt-4">Login to Your Account</h2>
          <div className="h-1 w-16 bg-red-500 mr-2 mt-4"></div>
      </div>

      <div className="flex mb-6">
        <label className="mr-4">
          <input
            type="radio"
            name="loginType"
            checked={isEmployeeLogin}
            onChange={() => setIsEmployeeLogin(true)}
            className="mr-1"
          />
          <span className="text-gray-600">As Employee</span>
        </label>
        <label>
          <input
            type="radio"
            name="loginType"
            checked={!isEmployeeLogin}
            onChange={() => setIsEmployeeLogin(false)}
            className="mr-1"
          />
          <span className="text-gray-600">As Customer</span>
        </label>
      </div>

      <form onSubmit={handleSubmit} className="space-y-2">
        <div>
          {serverError && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-2"
              role="alert"
            >
              {serverError}
            </div>
          )}
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-4 py-2 border border-gray-300 "
          />
          {emailError && <div className="text-red-600 mt-2 text-sm">{emailError}</div>}
        </div>

        <div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-2 border border-gray-300 mt-2 mb-2 "
          />
          {passwordError && <div className="text-red-600 mt-2 text-sm">{passwordError}</div>}
        </div>

        <button
          type="submit"
          className="w-36 bg-red-600 text-white py-2 hover:bg-red-700 mt-2"
        >
          LOGIN
        </button>
      </form>
    </div>
  </section>
);
}

export default LoginForm;

