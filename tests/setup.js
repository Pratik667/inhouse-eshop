"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const database_1 = __importDefault(require("../src/config/database"));
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
dotenv_1.default.config({ path: envFile });
let mongoServer;
jest.setTimeout(20000);
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.NODE_ENV === 'test' && !process.env.MONGO_URI_TEST) {
        mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
        process.env.MONGO_URI_TEST = mongoServer.getUri();
    }
    const uri = process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI_TEST || process.env.MONGO_URI || ''
        : process.env.MONGO_URI || '';
    if (!uri || !/^mongodb(?:\+srv)?:\/\//.test(uri)) {
        throw new Error('A valid Mongo URI is required for tests.');
    }
    if (mongoose_1.default.connection.readyState === 0) {
        yield (0, database_1.default)();
    }
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState !== 1) {
        return;
    }
    const collections = mongoose_1.default.connection.collections || {};
    for (const collectionName in collections) {
        const collection = collections[collectionName];
        if (collection && typeof collection.deleteMany === 'function') {
            yield collection.deleteMany({});
        }
    }
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    if (mongoose_1.default.connection.readyState === 1) {
        yield mongoose_1.default.disconnect();
    }
    if (mongoServer) {
        yield mongoServer.stop();
    }
}));
