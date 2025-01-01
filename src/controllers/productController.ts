import { Request, Response } from "express";
import Product from "../models/productModel";

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, price, image } = req.body;

    const product = new Product({ name, description, price, image });
    await product.save();

    return res.status(201).json({ message: "Product created successfully", product });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all products
export const getAllProducts = async (_req: Request, res: Response): Promise<any> => {
  try {
    const products = await Product.find();
    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json(product);
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name, description, price, image } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, image },
      { new: true, runValidators: true } // Return the updated document
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product updated successfully", product });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a product by ID
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
