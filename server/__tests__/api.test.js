const request = require("supertest");
const app = require("../index");

describe("API tests", () => {
  test("GET /api/health returns ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  test("GET /api/expenses without token returns 401", async () => {
    const res = await request(app).get("/api/expenses");
    expect(res.statusCode).toBe(401);
  });

  test("Register + login returns a token", async () => {
    // use a unique email each run to avoid conflicts
    const email = `test${Date.now()}@example.com`;
    const password = "Password123!";

    const registerRes = await request(app)
      .post("/api/auth/register")
      .send({ email, password });

    expect([201, 409]).toContain(registerRes.statusCode);

    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email, password });

    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.body.token).toBeTruthy();
  });
});

const db = require("../db");

afterAll(async () => {
  await db.end();
});

