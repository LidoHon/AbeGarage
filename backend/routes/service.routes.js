const express = require("express");
const router = express.Router();
const serviceController = require("../controllers/service.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Get all services
// router.get('/api/services', authMiddleware.verifyToken, serviceController.getAllServices);
router.get("/api/services", serviceController.getAllServices);

// Add a new service
router.post(
  "/api/services",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  serviceController.createService
);

// Update a service
router.put(
  "/api/services/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  serviceController.updateService
);

// Delete a service
router.delete(
  "/api/services/:id",
  authMiddleware.verifyToken,
  authMiddleware.isAdmin,
  serviceController.deleteService
);

module.exports = router;