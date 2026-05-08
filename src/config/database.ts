import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.NODE_ENV === "test"
        ? process.env.MONGO_URI_TEST || process.env.MONGO_URI
        : process.env.MONGO_URI;

    const conn = await mongoose.connect(mongoUri || "");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
      throw error;
    } else {
      console.error("An unknown error occurred");
      throw new Error("An unknown error occurred");
    }
  }
};

export default connectDB;
