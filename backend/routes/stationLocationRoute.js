import express from "express";
import {
  createStationLocation,
  deleteStationLocation,
  getAllStationLocations,
  getStationLocationById,
  updateStationLocation,
  getStationLocationRequest // Added missing import
} from "../controllers/stationLocationController.js";

const route = express.Router();

// RESTful Station Location Routes
route.post("/station-locations", createStationLocation);
route.get("/station-locations", getAllStationLocations);
route.get("/station-locations/:id", getStationLocationById);
route.put("/station-locations/:id", updateStationLocation);
route.delete("/station-locations/:id", deleteStationLocation);

// Route for fetching pending evaluation requests
route.get("/station-location-requests", getStationLocationRequest);

export default route;