import { Router } from "express";
import * as resourceController from "../controllers/resource.controller";
import { validateTable } from "../middlewares/table.middleware";
import { db } from "../db/knex";
import { authenticate, authorizeRole } from "../middlewares/auth.middleware";
import { auditLog } from "../middlewares/auditlog.middleware";

const router = Router();

// health check
router.get("/health", async (req, res) => {
  await db.raw("SELECT 1");
  res.json({ status: "ok", uptime: process.uptime() });
});

// Dynamic CRUD routes
router.post("/:resource", authenticate, auditLog("CREATE"), validateTable, resourceController.createOne);
router.get("/:resource", validateTable, resourceController.getAll);
router.get("/:resource/:id", validateTable, resourceController.getOne);
router.put("/:resource/:id", authenticate, auditLog("UPDATE"), validateTable, resourceController.updatePut);
router.patch("/:resource/:id", authenticate, auditLog("UPDATE"), validateTable, resourceController.updatePatch);
router.delete("/:resource/:id", authenticate, auditLog("DELETE"), authorizeRole('admin'), validateTable, resourceController.deleteOne);

export default router;