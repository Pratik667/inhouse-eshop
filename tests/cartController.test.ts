import { addToCart } from '../src/controllers/cartController';

jest.mock('../src/models/productModel', () => ({
  __esModule: true,
  default: { findById: jest.fn() },
}));
jest.mock('../src/models/cartModel', () => {
  const findOne = jest.fn();
  function MockCart(this: any, data: any) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
    this.items = this.items || [];
    this.totalPrice = this.totalPrice || 0;
  }
  (MockCart as any).findOne = findOne;
  return { __esModule: true, default: MockCart };
});

import Product from '../src/models/productModel';
import Cart from '../src/models/cartModel';

const makeRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('cartController:addToCart', () => {
  beforeEach(() => jest.clearAllMocks());

  test('returns 400 when missing ids', async () => {
    const req: any = { body: {} };
    const res = makeRes();
    await addToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('returns 404 when product not found', async () => {
    (Product.findById as jest.Mock).mockResolvedValue(null);
    const req: any = { body: { userId: 'u1', productId: 'p1', quantity: 1 } };
    const res = makeRes();
    await addToCart(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('creates new cart when none exists', async () => {
    (Product as any).findById.mockResolvedValue({ price: 10 });
    (Cart as any).findOne.mockResolvedValue(null);

    const req: any = {
      body: {
        userId: '507f1f77bcf86cd799439011',
        productId: '507f1f77bcf86cd799439012',
        quantity: 2,
      },
    };
    const res = makeRes();
    await addToCart(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
  });
});
