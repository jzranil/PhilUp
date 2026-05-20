import Logs from "../models/logsModel.js";

export const createLogs = async (req, res) => {
  try {
    const { traceID, userID, level, activity } = req.body;

    const newLogs = new Logs(req.body);
    const savedData = await newLogs.save();
    res.status(201).json(savedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllLogs = async (req, res) => {
  try {
    const logsData = await Logs.find();
    if (!logsData) {
      return res.status(404).json({ message: "Logs data not found" });
    }
    res.status(200).json(logsData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getLogsById = async (req, res) => {
  try {
    const id = req.params.id;
    const logsExist = await Logs.findById(id);
    if (!logsExist) {
      return res.status(404).json({ message: "Logs not found" });
    }
    res.status(200).json(logsExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteLogs = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Optimized: Only query DB once using findByIdAndDelete
    const deletedLogs = await Logs.findByIdAndDelete(id);
    
    if (!deletedLogs) {
      return res.status(404).json({ message: "Logs not found" });
    }
    
    res.status(200).json({ message: "Logs deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};