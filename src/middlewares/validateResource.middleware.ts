import { Request, Response, NextFunction } from "express";
import { db } from "../db/knex";
import { createDynamicSchema } from "../validators/resource.validator";

export async function validateResource(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const resourceParam = req.params.resource;
  if (!resourceParam || Array.isArray(resourceParam)) {
    return res.status(400).json({ message: "Invalid resource parameter" });
  }

  const tableName = resourceParam;
  try {
    // Lấy sample record đầu tiên từ DB hoặc schema.json
    const sample = await db(tableName).first();
    if (!sample)
      return res.status(400).json({ message: "Cannot validate empty table" });

    const schema = createDynamicSchema(sample);

    schema.parse(req.body); // Zod sẽ throw nếu invalid

    next();
  } catch (err: any) {
    if (err?.issues) {
      return res
        .status(400)
        .json({ message: "Validation error", errors: err.issues });
    }
    next(err);
  }
}
