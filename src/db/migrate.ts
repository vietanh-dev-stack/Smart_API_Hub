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
        table.increments('id'); // Tự động tạo cột id auto-increment
        Object.entries(sample).forEach(([col, val]) => {
          if (col === 'id') return;
          // Suy đoán kiểu dữ liệu từ giá trị mẫu
          if (typeof val === 'number') table.integer(col);
          else if (typeof val === 'boolean') table.boolean(col);
          else table.text(col); // Mặc định là text
        });
      });
      console.log(`✅ Đã tạo bảng "${tableName}"`);
    }
  }
}