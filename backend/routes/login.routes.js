const express = require('express');
const router = express.Router();
const loginControllers = require("../controllers/login.controller");

// Employee login route
router.post("/api/employee/login", loginControllers.logInEmployee);

// Customer login route
router.post("/api/customer/login", loginControllers.logInCustomer);

module.exports = router;
