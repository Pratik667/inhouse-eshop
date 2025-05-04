import express from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByCategory,
  getProductByBrand,
  getProductByEvent,
  updateProduct,
  deleteProduct,
} from "../controllers/productController";
import { verifyAdmin, verifyToken } from "../middleware/authMiddleware";

const router = express.Router();

console.log("Inside Product Routes");
// Define product routes
router.post("/",verifyAdmin || verifyToken,  createProduct); // Create a product
router.get("/", getAllProducts); // Get all products
router.get("/:id", getProductById); // Get a product by ID
router.get("/category/:category", getProductByCategory);
router.get("/brand/:brand", getProductByBrand);
router.get("/event/:event", getProductByEvent);
router.put("/:id",verifyAdmin || verifyToken, updateProduct); // Update a product by ID
router.delete("/:id",verifyAdmin || verifyToken, deleteProduct); // Delete a product by ID

export default router;
