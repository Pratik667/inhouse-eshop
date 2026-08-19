import request from 'supertest';
import app from '../src/index';

describe('Health API', () => {
  it('GET /health returns ok and timestamp', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.timestamp).toBeDefined();
  });
});
