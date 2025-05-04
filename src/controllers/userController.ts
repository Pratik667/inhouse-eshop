import { Request, Response } from "express";
import User from "../models/userModel";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { IGetUserAuthInfoRequest } from "../types/express";

export const registerUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, email, password, role, team, eid } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    await User.create({ eid, name, email, password, role, team });
    return res.status(201).json({ message: "User Registered" });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

// Login User
export const loginUser = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  console.log("Inside Login user");
  try {
    const user = await User.findOne({ email });
    console.log(`User data: ${user}`);
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await user.comparePassword(password); // Compare password
    console.log(`User data: ${isMatch}`);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "", {
      expiresIn: "1h",
    });

    // Set token in response headers
    console.log(`setting header`);
    res.setHeader("Authorization", `Bearer ${token}`);

    console.log(`all done`);
    // Return success response with token
    return res.status(200).json({
      message: "Login successful",
      token,
    });
  } catch (error: any) {
    console.log("Failed in catch");
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

//show all users to admin
export const allUsers = async (req: Request, res: Response): Promise<any> => {
  try {
    const users = await User.find({}, "-password"); // Exclude passwords from the result
    res.status(200).json(users);
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Controller to update email, name, role and team of a user
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;
  const { name, email, role, team } = req.body;
  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    // Ensure only email, name, role and team are updated
    const updates: { name?: string; email?: string; role?: string; team?: string } = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (role) updates.role = role;
    if (team) updates.team = team;

    // Update the user
    const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUsersInSameTeam = async (req: IGetUserAuthInfoRequest, res: Response): Promise<any> => {
  try {
    // Ensure user is authenticated and has role "manager"
    const loggedInUser = req.user;
    if (!loggedInUser || loggedInUser.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Managers only." });
    }

    // Fetch users in the same team
    const teamUsers = await User.find({ team: loggedInUser.team }).select("-password");

    return res.status(200).json({
      message: "Users in the same team",
      users: teamUsers,
    });
  } catch (error: any) {
    console.error("Error fetching team users:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getUserByID= async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    res.status(200).json({
      message: user
    });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//delete user by id
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  const { userId } = req.params;
  try {
    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "User does not exists" });
    }
    await User.findByIdAndDelete(userId); // Exclude passwords from the result
    res.status(200).json({
      message: "User deleted"
    });
  } catch (error: any) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

