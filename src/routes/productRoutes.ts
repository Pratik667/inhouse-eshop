import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

// Define product routes
router.post("/",verifyAdmin || verifyToken,  createProduct); // Create a product
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get a product by ID
router.put("/:id",verifyAdmin || verifyToken, updateProduct); // Update a product by ID
router.delete("/:id",verifyAdmin || verifyToken, deleteProduct); // Delete a product by ID

export default router;
