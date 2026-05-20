import StationLocation from "../models/stationLocationModel.js";

export const createStationLocation = async (req, res) => {
  try {
    const { brandID, stationLong, stationLat } = req.body;    
    
    const stationExist = await StationLocation.findOne({ 
      brandID, 
      stationLong, 
      stationLat 
    });
    
    if (stationExist) {
      if (stationExist.isAccepted === 1) {
        return res.status(400).json({ message: "This exact station location is already registered and accepted." });
      }
      if (stationExist.forEval === 1) {
        return res.status(400).json({ message: "This station location has already been submitted and is under evaluation." });
      }
      return res.status(400).json({ message: "This station location already exists in the system." });
    }    
    
    const newStationLocation = new StationLocation(req.body); // Let the model handle forEval/isAccepted defaults
    const savedData = await newStationLocation.save();  
    res.status(201).json(savedData);    
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllStationLocations = async (req, res) => {
  try {
    const stationLocationData = await StationLocation.find();
    if (!stationLocationData) {
      return res.status(404).json({ message: "Station location data not found" }); 
    }
    res.status(200).json(stationLocationData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getStationLocationById = async (req, res) => {
  try {
    const id = req.params.id;
    const stationLocationExist = await StationLocation.findById(id);
    if (!stationLocationExist) {
      return res.status(404).json({ message: "Station location not found" });
    }
    res.status(200).json(stationLocationExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getStationLocationRequest = async (req, res) => {
  try {
    const forEval = 1;
    const stationLocationRequests = await StationLocation.find({ forEval });     
    if (!stationLocationRequests) {
      return res.status(404).json({ message: "Station location requests not found" });
    }
    res.status(200).json(stationLocationRequests);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getStationLocationApproved = async (req, res) => {
  try {
    const isAccepted = 1;
    const stationLocationApproved = await StationLocation.find({ isAccepted });     
    if (!stationLocationApproved) {
      return res.status(404).json({ message: "Station location approved not found" });
    }
    res.status(200).json(stationLocationApproved);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateStationLocation = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Security Fix: Destructure only the safe fields to prevent tampering 
    // with isAccepted and forEval statuses during an update.
    const { 
        brandID, 
        stationAddress, 
        stationLong, 
        stationLat, 
        prevVisits, 
        weeklyVisits 
    } = req.body;

    const safeUpdateData = { 
        brandID, 
        stationAddress, 
        stationLong, 
        stationLat, 
        prevVisits, 
        weeklyVisits 
    };

    // Remove any undefined fields so we don't accidentally wipe existing DB data
    Object.keys(safeUpdateData).forEach(key => safeUpdateData[key] === undefined && delete safeUpdateData[key]);

    const updatedData = await StationLocation.findByIdAndUpdate(id, safeUpdateData, {
      new: true,
      runValidators: true
    });
    
    if (!updatedData) {
      return res.status(404).json({ message: "Station location not found" });
    }
    
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteStationLocation = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedLocation = await StationLocation.findByIdAndDelete(id);
    if (!deletedLocation) {
      return res.status(404).json({ message: "Station location not found" });
    }    
    res.status(200).json({ message: "Station location deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateStationLocationRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedData = await StationLocation.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedData) {
      return res.status(404).json({
        message: "Station location request not found",
      });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};

export const deleteStationLocationRequest = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedData = await StationLocation.findByIdAndDelete(id);

    if (!deletedData) {
      return res.status(404).json({
        message: "Station location request not found",
      });
    }

    res.status(200).json({
      message: "Station location request deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};