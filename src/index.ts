import app from './app';
import { env } from './config/env';
import { runMigration } from './db/migrate';

async function start() {
  await runMigration();

  app.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
  });
}

start();