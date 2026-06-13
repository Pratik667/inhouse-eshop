import { getProductByCategory } from '../src/controllers/productController';

jest.mock('../src/models/productModel', () => ({ __esModule: true, default: { find: jest.fn(), findById: jest.fn() } }));
import Product from '../src/models/productModel';

const makeRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('productController:getProductByCategory', () => {
  beforeEach(() => jest.clearAllMocks());

  test('400 when category missing', async () => {
    const req: any = { params: {} };
    const res = makeRes();
    await getProductByCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('404 when no products', async () => {
    (Product as any).find.mockResolvedValue([]);
    const req: any = { params: { category: 'shoes' } };
    const res = makeRes();
    await getProductByCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('200 when products found', async () => {
    (Product as any).find.mockResolvedValue([{ name: 'p' }]);
    const req: any = { params: { category: 'shoes' } };
    const res = makeRes();
    await getProductByCategory(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
