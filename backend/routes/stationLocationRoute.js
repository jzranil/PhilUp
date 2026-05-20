import express from "express";
import {
  createStationLocation,
  deleteStationLocation,
  getAllStationLocations,
  getStationLocationById,
  updateStationLocation,
  getStationLocationRequest,
  getStationLocationApproved,
  updateStationLocationRequest,
  deleteStationLocationRequest
} from "../controllers/stationLocationController.js";

const route = express.Router();

// RESTful Station Location Routes
route.post("/station-locations", createStationLocation);
route.get("/station-locations", getAllStationLocations);

// Request routes
route.get("/station-location-requests", getStationLocationRequest);
route.put("/station-location-requests/:id", updateStationLocationRequest);
route.delete("/station-location-requests/:id", deleteStationLocationRequest);

// Approved locations route
route.get("/station-locations/coverage", getStationLocationApproved);

// ID routes LAST
route.get("/station-locations/:id", getStationLocationById);
route.put("/station-locations/:id", updateStationLocation);
route.delete("/station-locations/:id", deleteStationLocation);

export default route;