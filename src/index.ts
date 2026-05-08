import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database";
import userRoutes from "./routes/userRoutes";
import productRoutes from "./routes/productRoutes";
import cartRoutes from "./routes/cartRoutes";
import wishlistRoutes from "./routes/wishlistRoutes";
import serverless from "serverless-http";
const dns = require('node:dns');
dns.setServers(['8.8.8.8', '1.1.1.1', '8.8.4.4']);

console.log('DNS servers set to Google & Cloudflare');
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });



const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Database Connection
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

//cors issue fix - on localhost, the frontend runs on a different port (e.g., 5173) than the backend (e.g., 5000), which is considered a different origin. To allow the frontend to communicate with the backend without being blocked by CORS policy, we need to enable CORS in our Express server.
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

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

// Start Server when not running in test mode
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// Create server and export handler
export default app;
export const handler = serverless(app);
