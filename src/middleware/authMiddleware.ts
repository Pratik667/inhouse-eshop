import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { IGetUserAuthInfoRequest } from "../types/express";

export const verifyAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer <token>
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key") as { id: string };

    // Find the user by ID from the token
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if the user is an admin
    if (user.role !== "admin") {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }

    // Attach user to the request object
    req.body.admin = user;

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error("Authorization error:", error);
    res.status(403).json({ message: "Invalid token or unauthorized access." });
  }
}

export const verifyToken = async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Token in "Bearer <token>" format
    if (!token) {
      return res.status(401).json({ message: "No token provided. Unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key") as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }
    if (user.role !== "manager") {
      return res.status(403).json({ message: "Access denied. Manager only." });
    }
    req.user = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      team: user.team,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token. Unauthorized." });
  }
};