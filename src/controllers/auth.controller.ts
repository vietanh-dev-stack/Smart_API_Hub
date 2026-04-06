import { Request, Response } from "express";
import { db } from "../db/knex";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export async function register(req: Request, res: Response) {
  const { email, password, role } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  // check existing user
  const existing = await db("users").where({ email }).first();
  if (existing) {
    return res.status(400).json({ error: "Email already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const [user] = await db("users")
    .insert({
      email,
      password: hashed,
      role: role || "client",
      created_at: new Date(),
      updated_at: new Date(),
    })
    .returning("*");

  delete user.password;

  return res.status(201).json(user);
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email & password required" });
  }

  const user = await db("users").where({ email }).first();
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
    expiresIn: "1h",
  });

  return res.json({ token });
}
