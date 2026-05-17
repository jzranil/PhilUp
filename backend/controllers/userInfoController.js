import UserInfo from "../models/userInfoModel.js";

export const createUserInfo = async (req, res) => {
  try {
    const { 
      userFName, 
      userLName, 
      userBirthDate, 
      userAddress, 
      userEmail, 
      userContact, 
      userName, 
      userPassword 
    } = req.body;    
    
    // Check for duplicates in unique fields
    const userExist = await UserInfo.findOne({
      $or: [
        { userEmail },
        { userContact },
        { userName }
      ]
    });    
    
    // Excellent logic here to tell the frontend exactly what failed
    if (userExist) {
      if (userExist.userEmail === userEmail) {
        return res.status(400).json({ message: "This email address is already registered." });
      }
      if (userExist.userContact === userContact) {
        return res.status(400).json({ message: "This contact number is already registered." });
      }
      if (userExist.userName === userName) {
        return res.status(400).json({ message: "This username is already taken." });
      }
    }    
    
    const newUserInfo = new UserInfo({
      userFName,
      userLName,
      userBirthDate,
      userAddress,
      userEmail,
      userContact,
      userName,
      userPassword // Note: Consider using bcrypt to hash this in the future!
    });
    
    const savedData = await newUserInfo.save();
    res.status(201).json(savedData);    
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllUserInfo = async (req, res) => {
  try {
    const userData = await UserInfo.find();
    if (!userData || userData.length === 0) {
      return res.status(404).json({ message: "User data not found" }); 
    }
    res.status(200).json(userData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const userInfoExist = await UserInfo.findById(id);
    if (!userInfoExist) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(userInfoExist);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const updates = { ...req.body };
    
    // Good security: preventing users from escalating their own permissions
    delete updates.userPermissionLevel; 
             
    const updatedData = await UserInfo.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true
    });
    
    if (!updatedData) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const updateUserPermission = async (req, res) => {
  try {
    const id = req.params.id;
    const { userPermissionLevel } = req.body;

    // Validate that the required field was actually sent
    if (userPermissionLevel === undefined) {
      return res.status(400).json({ message: "userPermissionLevel is required." });
    }

    // Only update the permission level, nothing else
    const updatedData = await UserInfo.findByIdAndUpdate(
      id, 
      { userPermissionLevel }, 
      { new: true, runValidators: true }
    );

    if (!updatedData) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(updatedData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteUserInfo = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedUser = await UserInfo.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};