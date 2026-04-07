import fs from "fs";
import path from "path";
import { db } from "./knex";

const filePath = path.join(process.cwd(), "schema.json");

export async function runMigration() {
  const raw = fs.readFileSync(filePath, "utf-8");
  const schema = JSON.parse(raw);

  for (const tableName of Object.keys(schema)) {
    const exists = await db.schema.hasTable(tableName);

    if (!exists) {
      const sample = schema[tableName][0];

      await db.schema.createTable(tableName, (table) => {
        table.increments("id");

        Object.entries(sample).forEach(([col, val]) => {
          if (col === "id") return;

          if (typeof val === "number") table.integer(col);
          else if (typeof val === "boolean") table.boolean(col);
          else table.text(col);
        });

        table.timestamp("created_at").defaultTo(db.fn.now());
        table.timestamp("updated_at").defaultTo(db.fn.now());
      });

      console.log(`Đã tạo bảng "${tableName}"`);
    }
  }

  // --- Tạo foreign key ---
  const tables = await db.raw(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema='public';
  `);

  const tableNames = tables.rows.map((r: any) => r.table_name);

  // categories.user_id -> users.id
  if (tableNames.includes("categories") && tableNames.includes("users")) {
    const hasFk = await db.schema.hasColumn("categories", "user_id");
    if (hasFk) {
      try {
        await db.schema.alterTable("categories", (table) => {
          table
            .foreign("user_id")
            .references("id")
            .inTable("users")
            .onDelete("SET NULL");
        });
        console.log("Tạo FK categories.user_id -> users.id");
      } catch (err) {}
    }
  }

  // products.category_id -> categories.id
  // products.user_id -> users.id
  if (tableNames.includes("products")) {
    try {
      await db.schema.alterTable("products", (table) => {
        table
          .foreign("category_id")
          .references("id")
          .inTable("categories")
          .onDelete("SET NULL");
        table
          .foreign("user_id")
          .references("id")
          .inTable("users")
          .onDelete("SET NULL");
      });
      console.log("Tạo FK products.category_id -> categories.id");
      console.log("Tạo FK products.user_id -> users.id");
    } catch (err) {}
  }

  const hasAuditLogsTable = await db.schema.hasTable("audit_logs");
  if (hasAuditLogsTable) {
    const hasUserIdFk = await db
      .raw(
        `
      SELECT constraint_name
      FROM information_schema.table_constraints
      WHERE table_name='audit_logs' AND constraint_type='FOREIGN KEY'
        AND constraint_name='audit_logs_user_id_foreign';
    `,
      )
      .then((res) => res.rows.length > 0);

    if (!hasUserIdFk) {
      await db.schema.alterTable("audit_logs", (table) => {
        table
          .foreign("user_id")
          .references("id")
          .inTable("users")
          .onDelete("SET NULL");
      });
      console.log("Tạo FK audit_logs.user_id -> users.id");
    }
  }
}
