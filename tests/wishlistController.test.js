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
jest.resetModules();
class MockedObjectId {
    constructor(id) {
        this.id = id;
    }
    toString() {
        return String(this.id);
    }
}
jest.doMock('mongoose', () => ({ Types: { ObjectId: MockedObjectId } }));
jest.doMock('../src/models/productModel', () => ({
    __esModule: true,
    default: { findById: jest.fn() },
}));
jest.doMock('../src/models/wishlistModel', () => {
    const findOne = jest.fn();
    function MockWishlist(data) {
        Object.assign(this, data);
        this.save = jest.fn().mockResolvedValue(this);
        this.items = this.items || [];
    }
    MockWishlist.findOne = findOne;
    return { __esModule: true, default: MockWishlist };
});
const { addToWishlist } = require('../src/controllers/wishlistController');
const Product = require('../src/models/productModel').default;
const Wishlist = require('../src/models/wishlistModel').default;
const makeRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};
describe('wishlist:addToWishlist', () => {
    beforeEach(() => jest.clearAllMocks());
    test('returns 400 when missing ids', () => __awaiter(void 0, void 0, void 0, function* () {
        const req = { body: {} };
        const res = makeRes();
        yield addToWishlist(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
    }));
    test('returns 404 when product not found', () => __awaiter(void 0, void 0, void 0, function* () {
        Product.findById.mockResolvedValue(null);
        const req = {
            body: {
                userId: '507f1f77bcf86cd799439011',
                productId: '507f1f77bcf86cd799439012',
            },
        };
        const res = makeRes();
        yield addToWishlist(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
    }));
    test('returns 200 when item added to new wishlist', () => __awaiter(void 0, void 0, void 0, function* () {
        Product.findById.mockResolvedValue({ price: 5 });
        Wishlist.findOne.mockResolvedValue(null);
        const req = { body: { userId: 'u1', productId: 'p1' } };
        const res = makeRes();
        yield addToWishlist(req, res);
        expect(res.status).toHaveBeenCalledWith(200);
    }));
});
