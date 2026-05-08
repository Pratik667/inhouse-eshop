import mongoose from "mongoose";
import connectDB from "../src/config/database";

jest.setTimeout(20000);

beforeAll(async () => {
  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const collectionName in collections) {
    const collection = collections[collectionName];
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.disconnect();
});
