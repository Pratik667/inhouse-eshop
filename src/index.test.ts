import request from 'supertest'; // Supertest to test HTTP endpoints
import app from './index'; // Assuming you use a default export for app in index.ts

describe("Express App", () => {
  it("should respond with a 200 status code on the root route", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.text).toBe("Hello from AWS Lambda!"); // Adjust if the root response text is different
  });

  it("should respond with a 404 status code for an invalid route", async () => {
    const res = await request(app).get("/invalid-route");
    expect(res.status).toBe(404);
    expect(res.body.message).toBe("Cannot GET /invalid-route");
  });

  // Test if the cart API route is working
  it("should get the cart (GET /api/cart)", async () => {
    const res = await request(app).get("/api/cart/1"); // Replace with an actual userId
    expect(res.status).toBe(200);
    // You can further validate the response body (cart data) here if needed
  });

  // Test if the cart API allows adding items (POST /api/cart)
  it("should add an item to the cart (POST /api/cart)", async () => {
    const payload = {
      userId: "1", // Replace with actual userId if needed
      productId: "60c72b2f5b2c3b3c3c3c3c3c", // Replace with actual productId
      quantity: 2,
    };

    const res = await request(app).post("/api/cart").send(payload);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item added to cart");
    expect(res.body.cart).toHaveProperty("totalPrice");
    expect(res.body.cart.items).toHaveLength(1);
  });

  // Test if the cart API allows removing items (DELETE /api/cart)
  it("should remove an item from the cart (DELETE /api/cart)", async () => {
    const payload = {
      userId: "1", // Replace with actual userId
      productId: "60c72b2f5b2c3b3c3c3c3c3c", // Replace with actual productId
    };

    const res = await request(app).delete("/api/cart").send(payload);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe("Item removed from cart");
    expect(res.body.cart.items).toHaveLength(0); // If the item was successfully removed
  });
});

