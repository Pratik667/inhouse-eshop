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
const userController_1 = require("../src/controllers/userController");
jest.mock('../src/models/userModel', () => ({
    __esModule: true,
    default: { findOne: jest.fn(), create: jest.fn() },
}));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('tok') }));
const userModel_1 = __importDefault(require("../src/models/userModel"));
const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn();
    return res;
};
describe('userController: register and login', () => {
    beforeEach(() => jest.clearAllMocks());
    test('registerUser returns 400 when existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        userModel_1.default.findOne.mockResolvedValue({ id: 'u' });
        const req = { body: { email: 'a@b.com' } };
        const res = makeRes();
        yield (0, userController_1.registerUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
    test('registerUser returns 201 on success', () => __awaiter(void 0, void 0, void 0, function* () {
        userModel_1.default.findOne.mockResolvedValue(null);
        userModel_1.default.create.mockResolvedValue({ id: 'u' });
        const req = { body: { email: 'a@b.com', name: 'n', password: 'p' } };
        const res = makeRes();
        yield (0, userController_1.registerUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(201);
    }));
    test('loginUser returns 400 when user not found', () => __awaiter(void 0, void 0, void 0, function* () {
        userModel_1.default.findOne.mockResolvedValue(null);
        const req = { body: { email: 'x', password: 'p' } };
        const res = makeRes();
        yield (0, userController_1.loginUser)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
    test('loginUser returns 200 and sets header on success', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeUser = {
            _id: 'u1',
            comparePassword: jest.fn().mockResolvedValue(true),
        };
        userModel_1.default.findOne.mockResolvedValue(fakeUser);
        const req = { body: { email: 'x', password: 'p' } };
        const res = makeRes();
        yield (0, userController_1.loginUser)(req, res);
        expect(res.setHeader).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
    }));
});
