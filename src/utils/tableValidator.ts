import { db } from '../db/knex';

export async function tableExists(table: string) {
  const result = await db('information_schema.tables')
    .where({
      table_name: table,
      table_schema: 'public',
    })
    .first();

  return !!result;
}