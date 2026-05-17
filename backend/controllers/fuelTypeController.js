import FuelType from "../models/fuelTypeModel.js";

export const createFuelType = async (req, res) => {
  try {
    const { fuelTypeDesc } = req.body;
    
    // Check for duplicates using only fuelTypeDesc
    if (fuelTypeDesc) {
      const fuelTypeExist = await FuelType.findOne({ fuelTypeDesc });
      if (fuelTypeExist) {
        return res.status(400).json({ message: "A fuel type with this Description already exists" });
      }
    }
    
    const newFuelType = new FuelType(req.body);
    const savedData = await newFuelType.save();
    res.status(201).json(savedData); 
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllFuelTypes = async (req, res) => {
  try {
    const fuelTypeData = await FuelType.find();
    if (!fuelTypeData || fuelTypeData.length === 0) {
      return res.status(404).json({ message: "Fuel type data not found" }); // Changed 400 to 404
    }
    res.status(200).json(fuelTypeData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getFuelTypeById = async (req, res) => {
  try {
    const id = req.params.id;
    const fuelTypeExist = await FuelType.findById(id);
    if (!fuelTypeExist) {
      return res.status(404).json({ message: "Fuel type not found" });
    }
    res.status(200).json(fuelTypeExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateFuelType = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Optimized: Only query DB once using findByIdAndUpdate
    const updatedData = await FuelType.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true // Good practice to run schema validations on update
    });
    
    if (!updatedData) {
      return res.status(404).json({ message: "Fuel type not found" });
    }
    
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteFuelType = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Optimized: Only query DB once using findByIdAndDelete
    const deletedFuelType = await FuelType.findByIdAndDelete(id);
    
    if (!deletedFuelType) {
      return res.status(404).json({ message: "Fuel type not found" });
    }
    
    res.status(200).json({ message: "Fuel type deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};