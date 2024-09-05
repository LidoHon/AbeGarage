const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Function to generate and set token in cookies
function generateToken(res, employee) {
  const payload = {
    employee_id: employee.employee_id,
    employee_email: employee.employee_email,
    employee_role: employee.company_role_id,
    employee_first_name: employee.employee_first_name,
  };

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "30d",
  });

  // Set token as an HTTP-only cookie (prevent access from JavaScript)
  res.cookie("token", token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days

  return token;
}

module.exports = generateToken;
