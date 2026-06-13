import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../src/config/database';

const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv.config({ path: envFile });

let mongoServer: MongoMemoryServer | undefined;

jest.setTimeout(20000);

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test' && !process.env.MONGO_URI_TEST) {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URI_TEST = mongoServer.getUri();
  }

  const uri =
    process.env.NODE_ENV === 'test'
      ? process.env.MONGO_URI_TEST || process.env.MONGO_URI || ''
      : process.env.MONGO_URI || '';

  if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri)) {
    throw new Error('A valid Mongo URI is required for tests.');
  }

  if (mongoose.connection.readyState === 0) {
    await connectDB();
  }
});

afterEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    return;
  }

  const collections = mongoose.connection.collections || {};
  for (const collectionName in collections) {
    const collection = collections[collectionName];
    if (collection && typeof collection.deleteMany === 'function') {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }

  if (mongoServer) {
    await mongoServer.stop();
  }
});
