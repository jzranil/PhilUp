import express from "express";
import {
  createBrand,
  deleteBrand,
  getAllBrands,
  getBrandById,
  updateBrand,
} from "../controllers/brandController.js";

const route = express.Router();

// Clean, RESTful routes
route.post("/brands", createBrand);
route.get("/brands", getAllBrands);
route.get("/brands/:id", getBrandById);
route.put("/brands/:id", updateBrand);
route.delete("/brands/:id", deleteBrand);

export default route;