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
const authMiddleware_1 = require("../src/middleware/authMiddleware");
jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));
jest.mock('../src/models/userModel', () => ({ findById: jest.fn() }));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../src/models/userModel"));
const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('auth middleware', () => {
    beforeEach(() => jest.clearAllMocks());
    test('verifyAdmin: no token returns 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { headers: {} };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyAdmin)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    }));
    test('verifyAdmin: invalid token returns 403', () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockImplementation(() => {
            throw new Error('bad');
        });
        const req = { headers: { authorization: 'Bearer bad' } };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyAdmin)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    }));
    test('verifyAdmin: user not found returns 404', () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({ id: 'u1' });
        userModel_1.default.findById.mockResolvedValue(null);
        const req = { headers: { authorization: 'Bearer tok' }, body: {} };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyAdmin)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(404);
    }));
    test('verifyAdmin: non-admin returns 403', () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({ id: 'u1' });
        userModel_1.default.findById.mockResolvedValue({ role: 'manager' });
        const req = { headers: { authorization: 'Bearer tok' }, body: {} };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyAdmin)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(403);
    }));
    test('verifyAdmin: admin calls next', () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({ id: 'u1' });
        userModel_1.default.findById.mockResolvedValue({ role: 'admin' });
        const req = { headers: { authorization: 'Bearer tok' }, body: {} };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyAdmin)(req, res, next);
        expect(next).toHaveBeenCalled();
    }));
    test('verifyToken: no token returns 401', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { headers: {} };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyToken)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    }));
    test('verifyToken: invalid token returns 401', () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockImplementation(() => {
            throw new Error('bad');
        });
        const req = { headers: { authorization: 'Bearer bad' } };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyToken)(req, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
    }));
    test('verifyToken: valid token and user found calls next and sets req.user', () => __awaiter(void 0, void 0, void 0, function* () {
        jsonwebtoken_1.default.verify.mockReturnValue({ id: 'u1' });
        userModel_1.default.findById.mockResolvedValue({
            id: 'u1',
            name: 'n',
            email: 'e',
            role: 'manager',
            team: 't',
        });
        const req = { headers: { authorization: 'Bearer tok' } };
        const res = makeRes();
        const next = jest.fn();
        yield (0, authMiddleware_1.verifyToken)(req, res, next);
        expect(next).toHaveBeenCalled();
        expect(req.user).toBeDefined();
    }));
});
