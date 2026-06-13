import { Request, Response } from "express";
import mongoose from "mongoose";
import Cart from "../models/cartModel";
import Product from "../models/productModel";

// Add item to cart
export const addToCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userIdRaw = req.body.userId;
    const productIdRaw = req.body.productId;
    const quantity = req.body.quantity;
    const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;
    const productId = Array.isArray(productIdRaw) ? productIdRaw[0] : productIdRaw;

    if (!userId || !productId) {
      return res.status(400).json({ message: "userId and productId are required" });
    }

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const productObjectId = new mongoose.Types.ObjectId(productId);

    // Find the cart for the user
    let cart = await Cart.findOne({ user: userObjectId } as any);

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        user: userObjectId,
        items: [{ product: productObjectId, quantity }],
        totalPrice: product.price * quantity
      });
    } else {
      // Update cart with new item or increase quantity
      const existingItem = cart.items.find((item: any) => item.product.toString() === productId);

      if (existingItem) {
        // Update existing product quantity
        existingItem.quantity += quantity;
      } else {
        // Add new product to the cart
        cart.items.push({ product: productObjectId, quantity });
      }

      // Recalculate the total price
      let total = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
          total += product.price * item.quantity;
        }
      }
      cart.totalPrice = total;
    }

    // Save the cart
    await cart.save();

    return res.status(200).json({ message: "Item added to cart", cart });
  } catch (error: any) {
    console.error("Error adding item to cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req: Request, res: Response): Promise<any> => {
    try {
      const userIdRaw = req.body.userId;
      const productIdRaw = req.body.productId;
      const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;
      const productId = Array.isArray(productIdRaw) ? productIdRaw[0] : productIdRaw;

      if (!userId || !productId) {
        return res.status(400).json({ message: "userId and productId are required" });
      }
  
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Find the cart for the user
      const cart = await Cart.findOne({ user: userObjectId } as any);

      if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
      }
  
      // Remove the item from the cart
      cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
  
      // Recalculate the total price
      let total = 0;
      for (const item of cart.items) {
        const product = await Product.findById(item.product);
        if (product) {
          total += product.price * item.quantity;
        }
      }
      cart.totalPrice = total;
  
      // Save the cart
      await cart.save();
  
      return res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error: any) {
      console.error("Error removing item from cart:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  };
  

// Get user's cart
export const getCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const userIdRaw = req.params.userId;
    const userId = Array.isArray(userIdRaw) ? userIdRaw[0] : userIdRaw;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userObjectId } as any).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
