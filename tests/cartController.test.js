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
const cartController_1 = require("../src/controllers/cartController");
jest.mock('../src/models/productModel', () => ({
    __esModule: true,
    default: { findById: jest.fn() },
}));
jest.mock('../src/models/cartModel', () => {
    const findOne = jest.fn();
    function MockCart(data) {
        Object.assign(this, data);
        this.save = jest.fn().mockResolvedValue(this);
        this.items = this.items || [];
        this.totalPrice = this.totalPrice || 0;
    }
    MockCart.findOne = findOne;
    return { __esModule: true, default: MockCart };
});
const productModel_1 = __importDefault(require("../src/models/productModel"));
const cartModel_1 = __importDefault(require("../src/models/cartModel"));
const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('cartController:addToCart', () => {
    beforeEach(() => jest.clearAllMocks());
    test('returns 400 when missing ids', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: {} };
        const res = makeRes();
        yield (0, cartController_1.addToCart)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
    test('returns 404 when product not found', () => __awaiter(void 0, void 0, void 0, function* () {
        productModel_1.default.findById.mockResolvedValue(null);
        const req = { body: { userId: 'u1', productId: 'p1', quantity: 1 } };
        const res = makeRes();
        yield (0, cartController_1.addToCart)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    }));
    test('creates new cart when none exists', () => __awaiter(void 0, void 0, void 0, function* () {
        productModel_1.default.findById.mockResolvedValue({ price: 10 });
        cartModel_1.default.findOne.mockResolvedValue(null);
        const req = {
            body: {
                userId: '507f1f77bcf86cd799439011',
                productId: '507f1f77bcf86cd799439012',
                quantity: 2,
            },
        };
        const res = makeRes();
        yield (0, cartController_1.addToCart)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
});
