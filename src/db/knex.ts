import knex from 'knex';
import { env } from '../config/env';

// Tạo instance kết nối DB
export const db = knex({
  client: 'pg',
  connection: {
    host: env.db.host,
    port: env.db.port,
    database: env.db.name,
    user: env.db.user,
    password: env.db.password,
  },
});