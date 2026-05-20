import process from "node:process";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { Client } from "pg";

function parseArgs(argv) {
  const args = {};

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (!token.startsWith("--")) {
      continue;
    }

    const key = token.slice(2);
    const value = argv[index + 1];
    args[key] = value;
    index += 1;
  }

  return args;
}

function loadEnvFile(filePath) {
  const content = readFileSync(filePath, "utf8");
  const values = {};

  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();

    if (!trimmed || trimmed.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmed.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    values[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }

  return values;
}

function normalizeConnectionString(connectionString) {
  if (!connectionString) {
    return connectionString;
  }

  try {
    const url = new URL(connectionString);

    if (url.hostname === "localhost") {
      url.hostname = "127.0.0.1";
      return url.toString();
    }

    return connectionString;
  } catch {
    return connectionString;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let connectionString = args.dsn || process.env.DATABASE_URL;

  if (!connectionString) {
    const envPath = join(process.cwd(), ".env.local");

    if (existsSync(envPath)) {
      const envValues = loadEnvFile(envPath);
      connectionString = envValues.DATABASE_URL;
    }
  }

  if (!connectionString) {
    throw new Error("DATABASE_URL manquant. Passez --dsn ou exportez DATABASE_URL.");
  }

  connectionString = normalizeConnectionString(connectionString);

  const client = new Client({ connectionString });
  await client.connect();

  try {
    await client.query("begin");

    await client.query(`
      delete from meeting_notes
      where body ilike '%[E2E]%'
         or body ilike '%E2E%'
         or body ilike '%Playwright%'
    `);

    await client.query(`
      delete from meeting_actions
      where title ilike '%[E2E]%'
         or title ilike '%E2E%'
         or description ilike '%E2E%'
         or description ilike '%[E2E]%'
    `);

    await client.query(`
      delete from meetings
      where title ilike '%[E2E]%'
         or title ilike '%E2E%'
         or description ilike '%[E2E]%'
         or description ilike '%E2E%'
         or location ilike '%[E2E]%'
         or description ilike '%Playwright%'
    `);

    await client.query(`
      delete from task_comments
      where body ilike '%[E2E]%'
         or body ilike '%E2E%'
         or body ilike '%Playwright%'
    `);

    await client.query(`
      delete from tasks
      where title ilike '%[E2E]%'
         or title ilike '%E2E%'
         or description ilike '%[E2E]%'
         or description ilike '%E2E%'
         or description ilike '%Playwright%'
    `);

    await client.query(`
      delete from field_reports
      where topic ilike '%[E2E]%'
         or topic ilike '%E2E%'
         or summary ilike '%[E2E]%'
         or summary ilike '%E2E%'
         or summary ilike '%Playwright%'
         or array_to_string(coalesce(tags, '{}'::text[]), ',') ilike '%e2e%'
    `);

    await client.query(`
      delete from citizens
      where full_name ilike '%[E2E]%'
         or full_name ilike '%E2E%'
         or email ilike 'citizen.%@example.com'
         or notes ilike '%[E2E]%'
         or notes ilike '%E2E%'
         or notes ilike '%Playwright%'
         or array_to_string(coalesce(tags, '{}'::text[]), ',') ilike '%e2e%'
    `);

    await client.query(`
      delete from contacts
      where full_name ilike '%[E2E]%'
         or full_name ilike '%E2E%'
         or email ilike 'contact.%@example.com'
         or organization ilike '%[E2E]%'
         or organization ilike '%E2E%'
         or notes ilike '%[E2E]%'
         or notes ilike '%E2E%'
         or notes ilike '%Playwright%'
         or array_to_string(coalesce(tags, '{}'::text[]), ',') ilike '%e2e%'
    `);

    await client.query(`
      delete from users
      where email ilike '%@cabestany.local'
        and (
          full_name ilike '%E2E%'
          or email ilike 'user.%@cabestany.local'
          or email ilike 'access.%@cabestany.local'
          or email ilike 'delete.%@cabestany.local'
        )
    `);

    await client.query("commit");
    console.log("Données E2E purgées.");
  } catch (error) {
    await client.query("rollback");
    throw error;
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error?.stack || error?.message || String(error));
  process.exit(1);
});
