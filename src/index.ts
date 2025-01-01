import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import serverlessExpress from '@vendia/serverless-express';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes); // Product routes

// Start Server
 app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Export the handler
export const handler = serverlessExpress({ app });