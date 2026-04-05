import { Router } from "express";
import * as resourceController from "../controllers/resource.controller";
import { validateTable } from "../middlewares/validateTable.middleware";
import { db } from "../db/knex";

const router = Router();

// health check
router.get("/health", async (req, res) => {
  await db.raw("SELECT 1");
  res.json({ status: "ok", uptime: process.uptime() });
});

// Dynamic CRUD routes
router.post("/:resource", validateTable, resourceController.createOne);
router.get("/:resource", validateTable, resourceController.getAll);
router.get("/:resource/:id", validateTable, resourceController.getOne);
router.put("/:resource/:id", validateTable, resourceController.updatePut);
router.patch("/:resource/:id", validateTable, resourceController.updatePatch);
router.delete("/:resource/:id", validateTable, resourceController.deleteOne);

export default router;