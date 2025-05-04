import express from "express";
import { addToCart, removeFromCart, getCart } from "../controllers/cartController";

const router = express.Router();

console.log("Inside Cart Routes");
router.post("/add", addToCart); // Add product to cart
router.post("/remove", removeFromCart); // Remove product from cart
router.get("/:userId", getCart); // Get user cart

export default router;
