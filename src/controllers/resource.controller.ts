import { Request, Response } from "express";
import { db } from "../db/knex";
import { tableExists } from "../utils/tableValidator";
import { relations } from "../config/relations";

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

// GET all with optional _fields, _expand, _embed
export async function getAll(
  req: Request<{ resource: string }, any, any, any>,
  res: Response
) {
  const { resource } = req.params;
  if (!resource || typeof resource !== "string") {
    return res.status(400).json({ error: "Invalid resource" });
  }

  if (!(await tableExists(resource))) {
    return res.status(404).json({ error: `Resource '${resource}' not found` });
  }

  const { _fields, _page, _limit, _sort, _order, q, _expand, _embed, ...filters } = req.query;

  // --- Select fields ---
  let fields: string[] | undefined;
  if (_fields && typeof _fields === "string") {
    fields = _fields.split(",").map((f) => f.trim());
    const columns = await db(resource).columnInfo();
    const invalidCols = fields.filter((f) => !(f in columns));
    if (invalidCols.length > 0) {
      return res.status(400).json({ error: `Invalid columns: ${invalidCols.join(", ")}` });
    }
  }

  // --- Pagination ---
  const page = _page ? parseInt(_page as string) : 1;
  const limit = _limit ? parseInt(_limit as string) : 10;
  const offset = (page - 1) * limit;

  // --- Sorting ---
  const sortCol = _sort ? String(_sort) : "id";
  const order = _order === "desc" ? "desc" : "asc";

  // --- Build query ---
  let query = db(resource);

  // --- Search ---
  if (q && typeof q === "string") {
    const columns = await db(resource).columnInfo();
    const textCols = Object.entries(columns)
      .filter(([_, info]) => info.type.includes("text"))
      .map(([col]) => col);

    query = query.where((qb) => {
      for (const col of textCols) {
        qb.orWhere(col, "ilike", `%${q}%`);
      }
    });
  }

  // --- Filters ---
  for (const [key, value] of Object.entries(filters)) {
    if (typeof value !== "string") continue;

    if (key.startsWith("_gte[")) {
      const col = key.slice(5, -1);
      query = query.where(col, ">=", value);
    } else if (key.startsWith("_lte[")) {
      const col = key.slice(5, -1);
      query = query.where(col, "<=", value);
    } else if (key.startsWith("_ne[")) {
      const col = key.slice(4, -1);
      query = query.whereNot(col, value);
    } else if (key.startsWith("_like[")) {
      const col = key.slice(6, -1);
      query = query.where(col, "ilike", `%${value}%`);
    }
  }

  // --- Count total ---
  const total = await query.clone().count("* as count").first();
  res.setHeader("X-Total-Count", total?.count ?? 0);

  // --- Apply select, limit, offset, order ---
  let data = fields
    ? await query.select(fields).limit(limit).offset(offset).orderBy(sortCol, order)
    : await query.select("*").limit(limit).offset(offset).orderBy(sortCol, order);

  // --- _embed (child resource) ---
  if (_embed && typeof _embed === "string") {
    const childResource = _embed;
    if (await tableExists(childResource)) {
      const parentIds = data.map((d: any) => d.id);

      const fkColumn = relations[resource]?.[childResource];
      if (!fkColumn) {
        return res.status(400).json({ error: `No relation defined for ${resource} -> ${childResource}` });
      }

      const children = await db(childResource).whereIn(fkColumn, parentIds);

      const grouped = children.reduce((acc: any, child: any) => {
        const key = child[fkColumn];
        if (!acc[key]) acc[key] = [];
        acc[key].push(child);
        return acc;
      }, {});

      data.forEach((d: any) => {
        d[childResource] = grouped[d.id] || [];
      });
    }
  }

  // --- _expand (parent resource) ---
  if (_expand && typeof _expand === "string") {
    const parentResource = _expand;
    if (await tableExists(parentResource)) {
      const parentFkColumn = Object.entries(relations[parentResource] || {}).find(
        ([child, col]) => child === resource
      )?.[1];

      if (!parentFkColumn) {
        return res.status(400).json({ error: `No relation defined for ${resource} -> ${parentResource}` });
      }

      const parentIds = data.map((d: any) => d[parentFkColumn]);
      const parents = await db(parentResource).whereIn("id", parentIds);
      const parentMap = Object.fromEntries(parents.map((p: any) => [p.id, p]));

      data.forEach((d: any) => {
        d[parentResource] = parentMap[d[parentFkColumn]] || null;
      });
    }
  }

  return res.json(data);
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
