import request from "supertest";
import { describe, it, expect, beforeAll } from "vitest";
import app from "../app";
import { db } from "../db/knex";

let tokenAdmin: string;
let tokenUser: string;

beforeAll(async () => {
  // Xóa dữ liệu cũ để test sạch
  await db("products").del();
  await db("categories").del();
  await db("users").del();

  // Tạo user admin
  const resAdmin = await request(app)
    .post("/auth/register")
    .send({ email: "admin@test.com", password: "123456", role: "admin" });
  const loginAdmin = await request(app)
    .post("/auth/login")
    .send({ email: "admin@test.com", password: "123456" });
  tokenAdmin = loginAdmin.body.token;

  // Tạo user thường
  const resUser = await request(app)
    .post("/auth/register")
    .send({ email: "user@test.com", password: "123456" });
  const loginUser = await request(app)
    .post("/auth/login")
    .send({ email: "user@test.com", password: "123456" });
  tokenUser = loginUser.body.token;

  describe("Auth & Resource API", () => {
    it("Should register a new user (Happy Path)", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "newuser@test.com", password: "abcdef" });
      expect(res.status).toBe(201);
      expect(res.body.email).toBe("newuser@test.com");
      expect(res.body.password).toBeUndefined();
    });

    it("Should fail register with invalid email (400)", async () => {
      const res = await request(app)
        .post("/auth/register")
        .send({ email: "invalid", password: "123456" });
      expect(res.status).toBe(400);
    });

    it("Should login successfully (Happy Path)", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "admin@test.com", password: "123456" });
      expect(res.status).toBe(200);
      expect(res.body.token).toBeDefined();
    });

    it("Should fail login with wrong password (401)", async () => {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "admin@test.com", password: "wrongpass" });
      expect(res.status).toBe(401);
    });

    it("Should create category as admin (Happy Path)", async () => {
      const res = await request(app)
        .post("/categories")
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ name: "Electronics", user_id: 1 });
      expect(res.status).toBe(201);
      expect(res.body.name).toBe("Electronics");
    });

    it("Should fail create category without token (401)", async () => {
      const res = await request(app)
        .post("/categories")
        .send({ name: "Books", user_id: 1 });
      expect(res.status).toBe(401);
    });

    it("Should get categories (Happy Path)", async () => {
      const res = await request(app).get("/categories");
      expect(res.status).toBe(200);
      expect(res.body.length).toBeGreaterThan(0);
    });

    it("Should update category (PUT) as admin", async () => {
      const category = await db("categories").first();
      const res = await request(app)
        .put(`/categories/${category.id}`)
        .set("Authorization", `Bearer ${tokenAdmin}`)
        .send({ name: "Updated Electronics", user_id: 1 });
      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Updated Electronics");
    });

    it("Should fail DELETE category as normal user (403)", async () => {
      const category = await db("categories").first();
      const res = await request(app)
        .delete(`/categories/${category.id}`)
        .set("Authorization", `Bearer ${tokenUser}`);
      expect(res.status).toBe(403);
    });

    it("Should DELETE category as admin (Happy Path)", async () => {
      const category = await db("categories").first();
      const res = await request(app)
        .delete(`/categories/${category.id}`)
        .set("Authorization", `Bearer ${tokenAdmin}`);
      expect(res.status).toBe(204);
    });
  });
});
