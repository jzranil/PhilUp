import express from "express";
import {
  createFuelType,   // Fixed capitalization
  deleteFuelType,   // Fixed capitalization
  getAllFuelTypes,  // Fixed capitalization
  getFuelTypeById,  // Fixed capitalization
  updateFuelType,   // Fixed capitalization
} from "../controllers/fuelTypeController.js";

const route = express.Router();

// Clean, RESTful routes
route.post("/fuel-types", createFuelType);
route.get("/fuel-types", getAllFuelTypes);
route.get("/fuel-types/:id", getFuelTypeById);
route.put("/fuel-types/:id", updateFuelType);
route.delete("/fuel-types/:id", deleteFuelType);

export default route;