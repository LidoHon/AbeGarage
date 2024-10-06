import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginService } from "../services/login.service";
import { useAuth } from "../../Contexts/AuthContext"; // Import the AuthContext

function LoginForm() {
  const { setIsLogged, setEmployee, setCustomer } = useAuth(); // Use context to set login state
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [serverError, setServerError] = useState("");
  // Toggle between employee and customer
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
      // Call the appropriate service based on login type
      const loginResponse = isEmployeeLogin
        ? await loginService.logInEmployee(formData)
        : await loginService.logInCustomer(formData);

      const response = await loginResponse.json();
      console.log("Response from Server:", response);

      if (response.status === "success") {
        if (isEmployeeLogin) {
          // Clear previous customer data and store new employee data
          localStorage.removeItem("customer"); // Clear customer data if logging in as employee
          const employeeData = {
            employee_token: response.data.employee_token,
            employee_role: response.data.employee_role,
            employee_first_name: response.data.employee_first_name,
          };
          localStorage.setItem("employee", JSON.stringify(employeeData));
          setEmployee(employeeData);
        } else {
          // Clear previous employee data and store new customer data
          localStorage.removeItem("employee"); 
          const customerData = {
            customer_token: response.data.customer_token,
            customer_first_name: response.data.customer_first_name,
          };
          localStorage.setItem("customer", JSON.stringify(customerData));
          setCustomer(customerData);
        }

        setIsLogged(true);

        // Redirect based on user type
        navigate(isEmployeeLogin ? "/" : "/");
      } else {
        setServerError(response.message);
      }
    } catch (err) {
      console.log("Error:", err);
      setServerError("An error has occurred. Please try again later.");
    }
  };

  return (
    <section className="min-h-fit flex items-center justify-center my-10">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
        <div className="style-two ">
          <h2 className={`text-2xl font-semibold text-gray-900 text-center mb-4`}>
            Login to your account
          </h2>
        </div>

        {/* Toggle between Employee and Customer */}
        <div className="flex justify-center mb-6">
          <label className="mr-4">
            <input
              type="radio"
              name="loginType"
              checked={isEmployeeLogin}
              onChange={() => setIsEmployeeLogin(true)}
              className="mr-1"
            />
            <span className="text-gray-600">Employee Login</span>
          </label>
          <label>
            <input
              type="radio"
              name="loginType"
              checked={!isEmployeeLogin}
              onChange={() => setIsEmployeeLogin(false)}
              className="mr-1"
            />
            <span className="text-gray-600">Customer Login</span>
          </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Email Input */}
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
              name="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {emailError && (
              <div className="text-red-600 mt-2 text-sm">{emailError}</div>
            )}
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            {passwordError && (
              <div className="text-red-600 mt-2 text-sm">{passwordError}</div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition duration-300"
              data-loading-text="Please wait..."
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default LoginForm;
