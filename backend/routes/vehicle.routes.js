const express = require("express");
const router = express.Router();
const vehicleController = require("../controllers/vehicle.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Create a new vehicle
// router.post('/api/vehicle', authMiddleware.verifyToken, vehicleController.createVehicle);
router.post("/api/vehicle", vehicleController.createVehicle);

// Get all vehicles
// router.get('/api/vehicles', authMiddleware.verifyToken, vehicleController.getAllVehicles);
router.get("/api/vehicles", vehicleController.getAllVehicles);

// Get a specific vehicle by ID
router.get(
  "/api/vehicles/:id",
  authMiddleware.verifyToken,
  vehicleController.getVehicleById
);

// Update a vehicle
// router.put(
//   "/api/vehicles/:id",
//   authMiddleware.verifyToken,
//   vehicleController.updateVehicle
// );
router.put(
  "/api/vehicles/:id",

  vehicleController.updateVehicle
);

// Delete a vehicle
// router.delete(
//   "/api/vehicles/:id",
//   authMiddleware.verifyToken,
//   vehicleController.deleteVehicle
// );
router.delete(
  "/api/vehicles/:id",

  vehicleController.deleteVehicle
);

module.exports = router;