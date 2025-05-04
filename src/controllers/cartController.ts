import { Request, Response } from "express";
import Cart from "../models/cartModel";
import Product from "../models/productModel";

// Add item to cart
export const addToCart = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId, productId, quantity } = req.body;

    // Find the product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Find the cart for the user
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // Create a new cart if none exists
      cart = new Cart({
        user: userId,
        items: [{ product: productId, quantity }],
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
        cart.items.push({ product: productId, quantity });
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
      const { userId, productId } = req.body;
  
      // Find the cart for the user
      const cart = await Cart.findOne({ user: userId });
  
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
    const { userId } = req.params;

    // Find the cart for the user
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    return res.status(200).json(cart);
  } catch (error: any) {
    console.error("Error fetching cart:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
