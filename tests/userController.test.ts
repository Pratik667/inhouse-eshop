import { registerUser, loginUser } from '../src/controllers/userController';

jest.mock('../src/models/userModel', () => ({ __esModule: true, default: { findOne: jest.fn(), create: jest.fn() } }));
jest.mock('jsonwebtoken', () => ({ sign: jest.fn().mockReturnValue('tok') }));

import User from '../src/models/userModel';
import jwt from 'jsonwebtoken';

const makeRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.setHeader = jest.fn();
  return res;
};

describe('userController: register and login', () => {
  beforeEach(() => jest.clearAllMocks());

  test('registerUser returns 400 when existing user', async () => {
    (User as any).findOne.mockResolvedValue({ id: 'u' });
    const req: any = { body: { email: 'a@b.com' } };
    const res = makeRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('registerUser returns 201 on success', async () => {
    (User as any).findOne.mockResolvedValue(null);
    (User as any).create.mockResolvedValue({ id: 'u' });
    const req: any = { body: { email: 'a@b.com', name: 'n', password: 'p' } };
    const res = makeRes();
    await registerUser(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
  });

  test('loginUser returns 400 when user not found', async () => {
    (User as any).findOne.mockResolvedValue(null);
    const req: any = { body: { email: 'x', password: 'p' } };
    const res = makeRes();
    await loginUser(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  test('loginUser returns 200 and sets header on success', async () => {
    const fakeUser: any = { _id: 'u1', comparePassword: jest.fn().mockResolvedValue(true) };
    (User as any).findOne.mockResolvedValue(fakeUser);
    const req: any = { body: { email: 'x', password: 'p' } };
    const res = makeRes();
    await loginUser(req, res);
    expect(res.setHeader).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
  });
});
