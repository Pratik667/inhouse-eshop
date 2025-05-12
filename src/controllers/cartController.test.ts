import request from 'supertest';
import app from '../index'; // Your Express app
import Cart from '../models/cartModel';
import Product from '../models/productModel';
import mongoose from 'mongoose';

jest.mock('../models/cartModel');
jest.mock('../models/productModel');

describe('Cart Controller Tests', () => {
  const mockProduct = {
    _id: '123',
    price: 100,
    name: 'Product 1',
    description: 'Product description',
  };

  const mockCart = {
    user: 'user123',
    items: [{ product: mockProduct._id, quantity: 1 }],
    totalPrice: 100,
    save: jest.fn(),
  };

  beforeAll(async () => {
    // Set up Mongoose to use a memory server for testing
    const mongoUri = process.env.MONGO_URI || "";
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /cart/add', () => {
    it('should add an item to the cart successfully', async () => {
      // Mock the product and cart models
      Product.findById = jest.fn().mockResolvedValue(mockProduct);
      Cart.findOne = jest.fn().mockResolvedValue(null); // Cart doesn't exist

      const response = await request(app)
        .post('/cart/add')
        .send({
          userId: 'user123',
          productId: mockProduct._id,
          quantity: 2,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item added to cart');
      expect(response.body.cart.items.length).toBe(1);
      expect(response.body.cart.totalPrice).toBe(200);
    });

    it('should return 404 if product not found', async () => {
      Product.findById = jest.fn().mockResolvedValue(null); // Product doesn't exist

      const response = await request(app)
        .post('/cart/add')
        .send({
          userId: 'user123',
          productId: 'invalid-id',
          quantity: 1,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Product not found');
    });

    it('should update existing product quantity in the cart', async () => {
      Cart.findOne = jest.fn().mockResolvedValue(mockCart); // Cart exists
      Product.findById = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/cart/add')
        .send({
          userId: 'user123',
          productId: mockProduct._id,
          quantity: 1, // Existing quantity will be updated
        });

      expect(response.status).toBe(200);
      expect(response.body.cart.items[0].quantity).toBe(2); // Quantity updated
      expect(response.body.cart.totalPrice).toBe(200); // Total price recalculated
    });
  });

  describe('POST /cart/remove', () => {
    it('should remove an item from the cart', async () => {
      Cart.findOne = jest.fn().mockResolvedValue(mockCart);
      Product.findById = jest.fn().mockResolvedValue(mockProduct);

      const response = await request(app)
        .post('/cart/remove')
        .send({
          userId: 'user123',
          productId: mockProduct._id,
        });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Item removed from cart');
      expect(response.body.cart.items.length).toBe(0);
      expect(response.body.cart.totalPrice).toBe(0);
    });

    it('should return 404 if cart not found', async () => {
      Cart.findOne = jest.fn().mockResolvedValue(null); // Cart not found

      const response = await request(app)
        .post('/cart/remove')
        .send({
          userId: 'user123',
          productId: mockProduct._id,
        });

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Cart not found');
    });
  });

  describe('GET /cart/:userId', () => {
    it('should return the cart for the given user', async () => {
      Cart.findOne = jest.fn().mockResolvedValue(mockCart);
      Product.findById = jest.fn().mockResolvedValue(mockProduct); // Populate product

      const response = await request(app).get('/cart/user123');

      expect(response.status).toBe(200);
      expect(response.body.user).toBe('user123');
      expect(response.body.items.length).toBe(1);
      expect(response.body.items[0].product._id).toBe(mockProduct._id);
    });

    it('should return 404 if cart not found', async () => {
      Cart.findOne = jest.fn().mockResolvedValue(null); // Cart not found

      const response = await request(app).get('/cart/invalid-user');

      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Cart not found');
    });
  });
});
