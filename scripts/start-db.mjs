import EmbeddedPostgres from "embedded-postgres";
import { existsSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const port = Number(process.env.PG_PORT ?? 5433);
const database = process.env.PG_DATABASE ?? "sg_diagnostic";

const pg = new EmbeddedPostgres({
  databaseDir: join(root, ".pgdata"),
  user: "postgres",
  password: "password",
  port,
  persistent: true,
});

const dataDir = join(root, ".pgdata");
const hasCluster = existsSync(join(dataDir, "PG_VERSION"));

if (!hasCluster) {
  await pg.initialise();
}
await pg.start();

try {
  await pg.createDatabase(database);
} catch {
  // database may already exist
}

console.log(
  JSON.stringify({
    port,
    database,
    url: `postgresql://postgres:password@127.0.0.1:${port}/${database}`,
  }),
);

// Keep process alive while dev server runs
process.on("SIGINT", async () => {
  await pg.stop();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  await pg.stop();
  process.exit(0);
});
