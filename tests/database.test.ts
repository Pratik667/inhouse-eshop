describe('connectDB', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  test('connects using MONGO_URI_TEST when NODE_ENV=test', async () => {
    process.env.NODE_ENV = 'test';
    process.env.MONGO_URI_TEST = 'mongodb://test-host';

    const connectMock = jest
      .fn()
      .mockResolvedValue({ connection: { host: 'test-host' } });
    jest.doMock('mongoose', () => ({ connect: connectMock }));

    const connectDB = (await import('../src/config/database')).default;

    await expect(connectDB()).resolves.toBeUndefined();
    expect(connectMock).toHaveBeenCalledWith('mongodb://test-host');
  });

  test('throws and logs on connection error', async () => {
    process.env.NODE_ENV = 'production';
    process.env.MONGO_URI = 'mongodb://prod-host';

    const err = new Error('boom');
    const connectMock = jest.fn().mockRejectedValue(err);
    jest.doMock('mongoose', () => ({ connect: connectMock }));

    const connectDB = (await import('../src/config/database')).default;

    await expect(connectDB()).rejects.toThrow('boom');
  });
});
