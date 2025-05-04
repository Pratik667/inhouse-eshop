import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import serverless from "serverless-http";

dotenv.config();

const app = express();
//const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes); // Product routes
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.get("/", (req: any, res: any) => res.send("Hello from AWS Lambda!"));
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send({ message: "inhouse-eshop: Internal Server Error" });
});

// Start Server
//app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// Create server and export handler
export const handler = serverless(app);