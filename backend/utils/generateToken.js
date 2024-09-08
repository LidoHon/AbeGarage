const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;

// Function to generate and set token in cookies
function generateToken(res, user, userType) {
  let payload = {};

  if (userType === "employee") {
    payload = {
      user_id: user.employee_id,
      user_email: user.employee_email,
      user_role: user.company_role_id,  // Only employees have roles
      user_first_name: user.employee_first_name,
      type: "employee", // To distinguish between customer and employee in the token
    };
  } else if (userType === "customer") {
    payload = {
      user_id: user.customer_id,
      user_email: user.customer_email,
      user_first_name: user.customer_first_name,
      type: "customer", // To distinguish between customer and employee in the token
    };
  }

  const token = jwt.sign(payload, jwtSecret, {
    expiresIn: "30d",
  });

  // Set token as an HTTP-only cookie (prevent access from JavaScript)
  res.cookie("token", token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 }); // 30 days

  return token;
}

module.exports = generateToken;
