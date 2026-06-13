import { verifyAdmin, verifyToken } from '../src/middleware/authMiddleware';

jest.mock('jsonwebtoken', () => ({ verify: jest.fn() }));
jest.mock('../src/models/userModel', () => ({ findById: jest.fn() }));

import jwt from 'jsonwebtoken';
import User from '../src/models/userModel';

const makeRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('auth middleware', () => {
  beforeEach(() => jest.clearAllMocks());

  test('verifyAdmin: no token returns 401', async () => {
    const req: any = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    await verifyAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('verifyAdmin: invalid token returns 403', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('bad'); });
    const req: any = { headers: { authorization: 'Bearer bad' } };
    const res = makeRes();
    const next = jest.fn();

    await verifyAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('verifyAdmin: user not found returns 404', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'u1' });
    (User.findById as jest.Mock).mockResolvedValue(null);
    const req: any = { headers: { authorization: 'Bearer tok' }, body: {} };
    const res = makeRes();
    const next = jest.fn();

    await verifyAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('verifyAdmin: non-admin returns 403', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'u1' });
    (User.findById as jest.Mock).mockResolvedValue({ role: 'manager' });
    const req: any = { headers: { authorization: 'Bearer tok' }, body: {} };
    const res = makeRes();
    const next = jest.fn();

    await verifyAdmin(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  test('verifyAdmin: admin calls next', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'u1' });
    (User.findById as jest.Mock).mockResolvedValue({ role: 'admin' });
    const req: any = { headers: { authorization: 'Bearer tok' }, body: {} };
    const res = makeRes();
    const next = jest.fn();

    await verifyAdmin(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('verifyToken: no token returns 401', async () => {
    const req: any = { headers: {} };
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('verifyToken: invalid token returns 401', async () => {
    (jwt.verify as jest.Mock).mockImplementation(() => { throw new Error('bad'); });
    const req: any = { headers: { authorization: 'Bearer bad' } };
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  test('verifyToken: valid token and user found calls next and sets req.user', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({ id: 'u1' });
    (User.findById as jest.Mock).mockResolvedValue({ id: 'u1', name: 'n', email: 'e', role: 'manager', team: 't' });
    const req: any = { headers: { authorization: 'Bearer tok' } };
    const res = makeRes();
    const next = jest.fn();

    await verifyToken(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
  });
});
