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
const productController_1 = require("../src/controllers/productController");
jest.mock('../src/models/productModel', () => ({
    __esModule: true,
    default: { find: jest.fn(), findById: jest.fn() },
}));
const productModel_1 = __importDefault(require("../src/models/productModel"));
const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('productController:getProductByCategory', () => {
    beforeEach(() => jest.clearAllMocks());
    test('400 when category missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { params: {} };
        const res = makeRes();
        yield (0, productController_1.getProductByCategory)(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
    test('404 when no products', () => __awaiter(void 0, void 0, void 0, function* () {
        productModel_1.default.find.mockResolvedValue([]);
        const req = { params: { category: 'shoes' } };
        const res = makeRes();
        yield (0, productController_1.getProductByCategory)(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    }));
    test('200 when products found', () => __awaiter(void 0, void 0, void 0, function* () {
        productModel_1.default.find.mockResolvedValue([{ name: 'p' }]);
        const req = { params: { category: 'shoes' } };
        const res = makeRes();
        yield (0, productController_1.getProductByCategory)(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
});
