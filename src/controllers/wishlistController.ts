import { Request, Response } from "express";
import mongoose from "mongoose";
import Wishlist from "../models/wishlistModel";
import Product from "../models/productModel";

// Add item to wishlist
export const addToWishlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, productId } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find the wishlist for the user
    let wishlist = await Wishlist.findOne({ user: userObjectId } as any);

    if (!wishlist) {
      // Create a new wishlist if none exists
      wishlist = new Wishlist({
        user: userObjectId,
        items: [{ product: productObjectId }]
      });
    } else {
      // Check if the item is already in the wishlist
      const existingItem = wishlist.items.find((item: any) => item.product.toString() === productId);

      if (existingItem) {
        return res.status(400).json({ message: "Product is already in wishlist" });
      }

      // Add the product to the wishlist
      wishlist.items.push({ product: productObjectId });
    }

    // Save the wishlist
    await wishlist.save();

    return res.status(200).json({ message: "Item added to wishlist", wishlist });
  } catch (error: any) {
    console.error("Error adding item to wishlist:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove item from wishlist
export const removeFromWishlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, productId } = req.body;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userObjectId } as any);

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    // Remove the item from the wishlist
    wishlist.items = wishlist.items.filter((item: any) => item.product.toString() !== productId);

    // Save the wishlist
    await wishlist.save();

    return res.status(200).json({ message: "Item removed from wishlist", wishlist });
  } catch (error: any) {
    console.error("Error removing item from wishlist:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user's wishlist
export const getWishlist = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the wishlist for the user
    const wishlist = await Wishlist.findOne({ user: userObjectId } as any).populate("items.product");

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    return res.status(200).json(wishlist);
  } catch (error: any) {
    console.error("Error fetching wishlist:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
