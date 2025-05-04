import express from "express";
import { addToWishlist, removeFromWishlist, getWishlist } from "../controllers/wishlistController";

const router = express.Router();

router.post("/add", addToWishlist); // Add product to wishlist
router.post("/remove", removeFromWishlist); // Remove product from wishlist
router.get("/:userId", getWishlist); // Get user wishlist

export default router;
