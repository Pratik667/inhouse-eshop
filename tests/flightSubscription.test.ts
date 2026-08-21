import request from 'supertest';
import app from '../src/index';
import FlightSubscription from '../src/models/flightSubscriptionModel';

describe('Flight subscription API', () => {
  const originalFetch = global.fetch;
  const originalApiKey = process.env.SERP_API_KEY;

  afterEach(() => {
    global.fetch = originalFetch;
    process.env.SERP_API_KEY = originalApiKey;
  });

  it('stores the current flight response and tracker fields', async () => {
    process.env.SERP_API_KEY = 'test-key';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({
        search_parameters: { currency: 'INR' },
        best_flights: [{ price: 5234, airline: 'Air India' }],
      }),
    }) as unknown as typeof fetch;

    const response = await request(app)
      .post('/api/flights/subscribe')
      .send({
        from: 'BOM',
        to: 'DEL',
        date: '2026-11-15',
        targetPrice: 4000,
        currency: 'INR',
      });

    expect(response.status).toBe(201);
    expect(response.body.subscription.origin).toBe('BOM');
    expect(response.body.subscription.destination).toBe('DEL');
    expect(response.body.subscription.flightResponse.best_flights[0].price).toBe(
      5234
    );
    expect(response.body.subscription.currentPrice).toBe(5234);

    const savedSubscription = await FlightSubscription.findOne({
      origin: 'BOM',
      destination: 'DEL',
    });
    expect(savedSubscription?.currentPrice).toBe(5234);
    expect(savedSubscription?.targetPrice).toBe(4000);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('engine=google_flights')
    );
  });

  it('rejects a subscription without search parameters', async () => {
    const response = await request(app)
      .post('/api/flights/subscribe')
      .send({ from: 'BOM', to: 'DEL' });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe('date must use YYYY-MM-DD format');
  });
});
