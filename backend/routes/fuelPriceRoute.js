import express from "express";
import {
  createFuelPrice,
  deleteFuelPrice,
  getAllFuelPrices,
  getFuelPriceById,
  updateAcceptedFuelPrice,
  getFuelPriceByStationLocID, 
  getFuelPriceRequest,        
  deletePastFuelPrices,
  getFuelPriceApproved,
  getFuelPriceApprovedByLocation   
} from "../controllers/fuelPriceController.js";

const route = express.Router();

// General Fuel Price routes
route.post("/fuel-prices", createFuelPrice);
route.get("/fuel-prices", getAllFuelPrices);
route.get("/fuel-prices/:id", getFuelPriceById);
route.put("/fuel-prices/:id", updateAcceptedFuelPrice);
route.delete("/fuel-prices/:id", deleteFuelPrice);

// Station-specific route
route.get("/fuel-prices/station/:stationLocID", getFuelPriceByStationLocID);

// Queue / Request routes
route.get("/fuel-price-requests", getFuelPriceRequest);
route.get("/fuel-price-requests/approved", getFuelPriceApproved);
route.get("/fuel-price-requests/station/:stationLocID", getFuelPriceApprovedByLocation);
route.delete("/fuel-price-requests/cleanup", deletePastFuelPrices);

export default route;