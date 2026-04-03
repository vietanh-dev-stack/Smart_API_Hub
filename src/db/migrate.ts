import fs from 'fs';
import path from 'path';
import { db } from './knex';

const filePath = path.join(process.cwd(), 'schema.json');

export async function runMigration() {
  const raw = fs.readFileSync(filePath, 'utf-8');
  const schema = JSON.parse(raw);

  for (const tableName of Object.keys(schema)) {
    const exists = await db.schema.hasTable(tableName);

    if (!exists) {
      const sample = schema[tableName][0];

      await db.schema.createTable(tableName, (table) => {
        table.increments('id');

        Object.entries(sample).forEach(([col, val]) => {
          if (typeof val === 'number') table.integer(col);
          else table.text(col);
        });

        table.timestamp('created_at').defaultTo(db.fn.now());
        table.timestamp('updated_at').defaultTo(db.fn.now());
      });

      console.log(`Created table ${tableName}`);
    }
  }
}