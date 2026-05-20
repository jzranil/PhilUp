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
  getFuelPriceApprovedByLocation,
  updateFuelPriceRequest,
  deleteFuelPriceRequest
} from "../controllers/fuelPriceController.js";

const route = express.Router();

// General
route.post("/fuel-prices", createFuelPrice);
route.get("/fuel-prices", getAllFuelPrices);

// Request routes FIRST
route.get("/fuel-price-requests", getFuelPriceRequest);
route.get("/fuel-price-requests/approved", getFuelPriceApproved);
route.get("/fuel-price-requests/station/:stationLocID", getFuelPriceApprovedByLocation);
route.delete("/fuel-price-requests/cleanup", deletePastFuelPrices);
route.put("/fuel-price-requests/:id", updateFuelPriceRequest);
route.delete("/fuel-price-requests/:id", deleteFuelPriceRequest);

// Station-specific
route.get("/fuel-prices/station/:stationLocID", getFuelPriceByStationLocID);

// ID routes LAST
route.get("/fuel-prices/:id", getFuelPriceById);
route.put("/fuel-prices/:id", updateAcceptedFuelPrice);
route.delete("/fuel-prices/:id", deleteFuelPrice);

export default route;