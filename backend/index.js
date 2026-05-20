import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";

// Import all of your individual route files
import brandRoute from "./routes/brandRoute.js";
import fuelTypeRoute from "./routes/fuelTypeRoute.js";
import stationLocationRoute from "./routes/stationLocationRoute.js";
import fuelPriceRoute from "./routes/fuelPriceRoute.js";
import userInfoRoute from "./routes/userInfoRoute.js";
import logsRoute from "./routes/logsRoute.js";

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 9000;
const MONGOURL = process.env.MONGO_URL; // Make sure your .env file uses MONGO_URL to match this!

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("DB connected Successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`);
    });
  })
  .catch((error) => console.log("DB ERROR: ", error));

// Mount all of your imported routes under the "/api" base path
app.use("/api", brandRoute);
app.use("/api", fuelTypeRoute);
app.use("/api", stationLocationRoute);
app.use("/api", fuelPriceRoute);
app.use("/api", userInfoRoute);
app.use("/api", logsRoute);