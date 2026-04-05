import { Request, Response } from "express";
import { db } from "../db/knex";
import { tableExists } from "../utils/tableValidator";

// CREATE
export async function createOne(
  req: Request<{ resource: string }, any, any>,
  res: Response,
) {
  const { resource } = req.params;
  const data = req.body;
  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({ error: "Body cannot be empty" });
  }

  if (!resource || typeof resource !== "string") {
    return res.status(400).json({ error: "Invalid resource" });
  }

  const [created] = await db(resource)
    .insert({ ...data, created_at: new Date(), updated_at: new Date() })
    .returning("*");

  res.status(201).json(created);
}

// GET all with optional _fields
export async function getAll(
  req: Request<{ resource: string }, any, any, { _fields?: string }>,
  res: Response,
) {
  const { resource } = req.params;
  
  console.log(`Fetching all from resource: ${resource} with fields: ${req.query._fields}`);
  if (!resource || typeof resource !== "string") {
    return res.status(400).json({ error: "Invalid resource" });
  }

  if (!(await tableExists(resource))) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  // Handle _fields
  let fields: string[] | undefined;
  if (req.query._fields) {
    fields = req.query._fields.split(",").map((f) => f.trim());

    // Check columns exist
    const columns = await db(resource).columnInfo();
    const invalidCols = fields.filter((f) => !(f in columns));
    if (invalidCols.length > 0) {
      return res
        .status(400)
        .json({ error: `Invalid columns: ${invalidCols.join(", ")}` });
    }
  }

  const data = fields
    ? await db(resource).select(fields)
    : await db(resource).select("*");
  res.json(data);
}

// GET one by id
export async function getOne(
  req: Request<{ resource: string; id: string }, any, any>,
  res: Response,
) {
  const { resource, id } = req.params;

  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid ID" });

  const row = await db(resource).where({ id }).first();
  if (!row) return res.status(404).json({ error: "Not found" });

  res.json(row);
}

// PUT - full update
export async function updatePut(
  req: Request<{ resource: string; id: string }, any, any>,
  res: Response,
) {
  const { resource, id } = req.params;
  const data = req.body;

  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid ID" });

  const existing = await db(resource).where({ id }).first();
  if (!existing) return res.status(404).json({ error: "Not found" });

  const [updated] = await db(resource)
    .where({ id })
    .update({ ...data, updated_at: new Date() })
    .returning("*");

  res.json(updated);
}

// PATCH - partial update
export async function updatePatch(
  req: Request<{ resource: string; id: string }, any, any>,
  res: Response,
) {
  const { resource, id } = req.params;
  const data = req.body;

  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid ID" });

  const existing = await db(resource).where({ id }).first();
  if (!existing) return res.status(404).json({ error: "Not found" });

  const [updated] = await db(resource)
    .where({ id })
    .update({ ...data, updated_at: new Date() })
    .returning("*");

  res.json(updated);
}

// DELETE
export async function deleteOne(
  req: Request<{ resource: string; id: string }, any, any>,
  res: Response,
) {
  const { resource, id } = req.params;

  if (!/^\d+$/.test(id)) return res.status(400).json({ error: "Invalid ID" });

  const existing = await db(resource).where({ id }).first();
  if (!existing) return res.status(404).json({ error: "Not found" });

  await db(resource).where({ id }).delete();
  res.status(204).send();
}
