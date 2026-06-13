jest.resetModules();
class MockedObjectId {
  id: any;
  constructor(id: any) {
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
  function MockWishlist(this: any, data: any) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
    this.items = this.items || [];
  }
  (MockWishlist as any).findOne = findOne;
  return { __esModule: true, default: MockWishlist };
});

const { addToWishlist } = require('../src/controllers/wishlistController');
const Product = require('../src/models/productModel').default;
const Wishlist = require('../src/models/wishlistModel').default;

const makeRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('wishlist:addToWishlist', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 400 when missing ids', async () => {
    const req: any = { body: {} };
    const res = makeRes();
    await addToWishlist(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 404 when product not found', async () => {
    (Product as any).findById.mockResolvedValue(null);
    const req: any = {
      body: {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
      },
    };
    const res = makeRes();
    await addToWishlist(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('returns 200 when item added to new wishlist', async () => {
    (Product as any).findById.mockResolvedValue({ price: 5 });
    (Wishlist as any).findOne.mockResolvedValue(null);
    const req: any = { body: { userId: 'u1', productId: 'p1' } };
    const res = makeRes();
    await addToWishlist(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
