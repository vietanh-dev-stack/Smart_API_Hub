import { z } from "zod";

export function createDynamicSchema(sample: Record<string, any>) {
  const schemaShape: Record<string, any> = {};

  Object.entries(sample).forEach(([key, value]) => {
    if (["id", "created_at", "updated_at"].includes(key)) return;

    if (typeof value === "number") schemaShape[key] = z.number();
    else if (typeof value === "boolean") schemaShape[key] = z.boolean();
    else schemaShape[key] = z.string();
  });

  return z.object(schemaShape);
}