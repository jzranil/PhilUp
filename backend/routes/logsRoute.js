import express from "express";
import {
  createLogs,       // Fixed capitalization
  deleteLogs,       // Fixed capitalization
  getAllLogs,       // Fixed capitalization
  getLogsById,      // Fixed capitalization
} from "../controllers/logsController.js";

const route = express.Router();

// Clean, RESTful routes
route.post("/logs", createLogs);
route.get("/logs", getAllLogs);
route.get("/logs/:id", getLogsById);
route.delete("/logs/:id", deleteLogs);

export default route;