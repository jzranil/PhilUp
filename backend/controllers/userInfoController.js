import UserInfo from "../models/userInfoModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
      userPassword,
    } = req.body;

    const userExist = await UserInfo.findOne({
      $or: [
        { userEmail },
        { userContact },
        { userName }
      ]
    });

    if (userExist) {

      if(userExist.userEmail===userEmail){
        return res.status(400).json({
          message:"Email already exists"
        });
      }

      if(userExist.userName===userName){
        return res.status(400).json({
          message:"Username already exists"
        });
      }

      if(userExist.userContact===userContact){
        return res.status(400).json({
          message:"Contact already exists"
        });
      }

    }

    const hashedPassword =
      await bcrypt.hash(userPassword,10);

    const newUser=new UserInfo({

      userFName,
      userLName,
      userBirthDate,
      userAddress,
      userEmail,
      userContact,
      userName,
      userPassword:hashedPassword

    });

    await newUser.save();

    res.status(201).json({
      message:"Account created successfully"
    });

  }

  catch(error){

    res.status(500).json({
      errorMessage:error.message
    });

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

export const loginUser = async (req, res) => {
  try {
    const { userName, userPassword } = req.body;

    const user = await UserInfo.findOne({ userName });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    const match = await bcrypt.compare(userPassword, user.userPassword);

    if (!match) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        name: user.userName,
      },
      process.env.JWT_SECRET || "philupsecret",
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        userFName: user.userFName,
        userLName: user.userLName,
        userEmail: user.userEmail,
        userName: user.userName,
        userPermissionLevel: user.userPermissionLevel,
      },
    });
  } catch (error) {
    res.status(500).json({
      errorMessage: error.message,
    });
  }
};