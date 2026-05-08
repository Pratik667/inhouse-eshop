import { Request, Response } from "express";
import Product from "../models/productModel";

const escapeRegex = (value: string): string => {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Create a new product
export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      description,
      price,
      image,
      brand,
      category,
      event,
      sizes,
      stock,
      variants,
      isActive,
    } = req.body;

    // Create a new product instance with the provided data
    const product = new Product({
      name,
      description,
      price,
      image,
      brand,
      category,
      event,
      sizes,
      stock,
      variants,
      isActive: isActive ?? true, // Default to true if not provided
    });

    await product.save(); // Save the product to the database

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

// Get product by category
export const getProductByCategory = async (req: Request, res: Response): Promise<any> => {
  try {
    const category = req.params.category;
    const products = await Product.find({
      category: { $regex: new RegExp(`^${escapeRegex(category)}$`, "i") },
      isActive: true,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found in this category." });
    }

    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products by category:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get product by brand
export const getProductByBrand = async (req: Request, res: Response): Promise<any> => {
  try {
    const brand = req.params.brand;
    const products = await Product.find({
      brand: { $regex: new RegExp(`^${escapeRegex(brand)}$`, "i") },
      isActive: true,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this brand." });
    }

    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products by brand:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get product by event
export const getProductByEvent = async (req: Request, res: Response): Promise<any> => {
  try {
    const event = req.params.event;
    const products = await Product.find({
      event: { $regex: new RegExp(`^${escapeRegex(event)}$`, "i") },
      isActive: true,
    });

    if (products.length === 0) {
      return res.status(404).json({ message: "No products found for this event." });
    }

    return res.status(200).json(products);
  } catch (error: any) {
    console.error("Error fetching products by event:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a product by ID
export const updateProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      name,
      description,
      price,
      image,
      brand,
      category,
      sizes,
      stock,
      variants,
      isActive,
    } = req.body;

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        image,
        brand,
        category,
        sizes,
        stock,
        variants,
        isActive, // Updating isActive as well
      },
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

// Soft delete a product (set isActive to false)
export const deleteProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false }, // Set isActive to false (soft delete)
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({ message: "Product deactivated successfully", product });
  } catch (error: any) {
    console.error("Error deactivating product:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
