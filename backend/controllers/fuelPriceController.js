import FuelPrice from "../models/fuelPriceModel.js";

export const createFuelPrice = async (req, res) => {
  try {
    const { 
      fuelDesc, 
      fuelTypeID, 
      stationLocID, 
      fuelPrice, 
      uploadedBy 
    } = req.body;
    
    // Check if there's already a pending request for this station/fuel/user
    const fuelPriceExist = await FuelPrice.findOne({ 
      stationLocID, 
      fuelTypeID, 
      uploadedBy, 
      forEval: 1 
    });
    
    if (fuelPriceExist) {
      return res.status(400).json({ message: "A pending fuel price request already exists" });
    }
    
    // We don't need to manually pass forEval anymore since the schema defaults to 1
    const newFuelPrice = new FuelPrice({
      fuelDesc,
      fuelTypeID,
      stationLocID,
      fuelPrice,
      uploadedBy
    });
    
    const savedData = await newFuelPrice.save();    
    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllFuelPrices = async (req, res) => {
  try {
    const fuelPriceData = await FuelPrice.find();
    if (!fuelPriceData || fuelPriceData.length === 0) {
      return res.status(404).json({ message: "Fuel price data not found" });
    }
    res.status(200).json(fuelPriceData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getFuelPriceById = async (req, res) => {
  try {
    const id = req.params.id;
    const fuelPriceExist = await FuelPrice.findById(id);
    if (!fuelPriceExist) {
      return res.status(404).json({ message: "Fuel price not found" });
    }
    res.status(200).json(fuelPriceExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getFuelPriceByStationLocID = async (req, res) => {
  try {
    const stationLocID = req.params.stationLocID;
    const isAccepted = 1;
    const forEval = 0;
    
    const fuelPrices = await FuelPrice.find({ stationLocID, isAccepted, forEval });
    if (!fuelPrices || fuelPrices.length === 0) {
      return res.status(404).json({ message: "Fuel prices not found for this station" });
    }
    res.status(200).json(fuelPrices);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getFuelPriceRequest = async (req, res) => {
  try {
    const forEval = 1;
    const fuelPrices = await FuelPrice.find({ forEval });
    if (!fuelPrices || fuelPrices.length === 0) {
      return res.status(404).json({ message: "Fuel price requests not found" });
    }
    res.status(200).json(fuelPrices);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateAcceptedFuelPrice = async (req, res) => {
  try {
    const id = req.params.id; // ID of the fuel price being approved
    
    // 1. Find the target fuel price request to get its location and fuel type
    const targetFuelPrice = await FuelPrice.findById(id);
    
    if (!targetFuelPrice) {
      return res.status(404).json({ message: "Fuel price request not found" });
    }

    const { stationLocID, fuelTypeID } = targetFuelPrice;

    // 2. Archive the OLD accepted price for this specific station and fuel type.
    // Setting isAccepted: 0 and forEval: 0 marks it as a historical record.
    await FuelPrice.updateMany(
      { 
        stationLocID, 
        fuelTypeID, 
        isAccepted: 1, 
        _id: { $ne: id } // Safety check: exclude the current one we are approving
      }, 
      { 
        isAccepted: 0, 
        forEval: 0 
      }
    );

    // 3. Accept the NEW price. 
    // We spread `req.body` in case the admin made a final tweak to the price before accepting.
    const updatePayload = {
      ...req.body,
      isAccepted: 1,
      forEval: 0
    };

    const updatedData = await FuelPrice.findByIdAndUpdate(
      id, 
      updatePayload, 
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedData);

  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteFuelPrice = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedFuelPrice = await FuelPrice.findByIdAndDelete(id);
    if (!deletedFuelPrice) {
      return res.status(404).json({ message: "Fuel price not found" });
    }
    res.status(200).json({ message: "Fuel price deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deletePastFuelPrices = async (req, res) => {
  try {
    const isAccepted = 0;
    const timeThreshold = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const result = await FuelPrice.deleteMany({
      isAccepted,
      dateCreated: { $lt: timeThreshold }
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No matching fuel prices found to delete" });
    }
    res.status(200).json({ 
      message: "Past fuel prices deleted successfully", 
      deletedCount: result.deletedCount 
    });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};