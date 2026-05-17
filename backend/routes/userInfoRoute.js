import express from "express";
import {
  createUserInfo,
  deleteUserInfo,
  getAllUserInfo,
  getUserById,
  updateUserInfo,
  updateUserPermission // <-- 1. Import the new function
} from "../controllers/userInfoController.js";

const route = express.Router();

// General User routes
route.post("/users", createUserInfo);
route.get("/users", getAllUserInfo);
route.get("/users/:id", getUserById);
route.put("/users/:id", updateUserInfo); // For updating name, address, etc.
route.delete("/users/:id", deleteUserInfo);

// Dedicated Security/Admin routes
route.patch("/users/:id/permissions", updateUserPermission); // <-- 2. Add the new route

export default route;