import { Router } from "express";
import * as resourceController from "../controllers/resource.controller";
import { validateTable } from "../middlewares/validateTable.middleware";
import { db } from "../db/knex";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";

const router = Router();

// health check
router.get("/health", async (req, res) => {
  await db.raw("SELECT 1");
  res.json({ status: "ok", uptime: process.uptime() });
});

// Dynamic CRUD routes
router.post("/:resource", authenticate, validateTable, resourceController.createOne);
router.get("/:resource", validateTable, resourceController.getAll);
router.get("/:resource/:id", validateTable, resourceController.getOne);
router.put("/:resource/:id", authenticate, validateTable, resourceController.updatePut);
router.patch("/:resource/:id", authenticate, validateTable, resourceController.updatePatch);
router.delete("/:resource/:id", authenticate, authorizeRole('admin'), validateTable, resourceController.deleteOne);

export default router;