import request from "supertest";
import app from "../src/index";

describe("User API", () => {
  it("should register and login a user in the test database", async () => {
    const testUser = {
      name: "Test User",
      email: `testuser+${Date.now()}@example.com`,
      password: "Password123!",
      role: "manager",
      team: "test-team",
    };

    const registerRes = await request(app)
      .post("/api/users/register")
      .send(testUser);

    expect(registerRes.status).toBe(201);
    expect(registerRes.body.message).toBe("User Registered");

    const loginRes = await request(app)
      .post("/api/users/login")
      .send({ email: testUser.email, password: testUser.password });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
  });
});
