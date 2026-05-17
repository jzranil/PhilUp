import Brand from "../models/brandModel.js";

export const createBrand = async (req, res) => {
  try {
    const { brandDesc } = req.body;
    if (brandDesc) {
      const brandExist = await Brand.findOne({ brandDesc });
      if (brandExist) {
        return res.status(400).json({ message: "A brand with this description already exists" });
      }
    }    
    const newBrand = new Brand(req.body);
    const savedData = await newBrand.save();
    res.status(201).json(savedData); 
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllBrands = async (req, res) => {
  try {
    const brandData = await Brand.find();
    if (!brandData || brandData.length === 0) {
      return res.status(404).json({ message: "Brand data not found" }); 
    }
    res.status(200).json(brandData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getBrandById = async (req, res) => {
  try {
    const id = req.params.id;
    const brandExist = await Brand.findById(id);
    if (!brandExist) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(brandExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateBrand = async (req, res) => {
  try {
    const id = req.params.id;    
    const updatedData = await Brand.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true 
    });
    if (!updatedData) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteBrand = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return res.status(404).json({ message: "Brand not found" });
    }
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};