import express from "express";
import { registerUser, loginUser, allUsers, updateUser, getUsersInSameTeam, deleteUser } from "../controllers/userController";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware";
const router = express.Router();

// Explicitly passing the controller function
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/all-users", verifyAdmin, allUsers); //admin only
router.patch("/update-user/:userId", verifyAdmin, updateUser); //admin only
router.delete("/delete-user/:userId", verifyAdmin, deleteUser); //admin only
router.get("/team-users", verifyToken, getUsersInSameTeam); //role: managers only

export default router;
