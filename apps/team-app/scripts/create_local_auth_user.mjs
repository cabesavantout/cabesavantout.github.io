import { createHmac, randomBytes, scryptSync } from "node:crypto";
import process from "node:process";
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

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const connectionString = args.dsn || process.env.DATABASE_URL;
  const email = args.email;
  const password = args.password;
  const fullName = args.name;
  const role = args.role || "admin";

  if (!connectionString) {
    throw new Error("DATABASE_URL manquant. Passez --dsn ou exportez DATABASE_URL.");
  }

  if (!email || !password || !fullName) {
    throw new Error("Utilisation: --email <email> --password <motdepasse> --name <nom> [--role admin]");
  }

  const client = new Client({ connectionString });
  await client.connect();

  try {
    const passwordHash = hashPassword(password);
    const result = await client.query(
      `
        insert into users (email, full_name, role, is_active, password_hash, password_updated_at)
        values (lower($1), $2, $3::app_role, true, $4, now())
        on conflict (email)
        do update set
          full_name = excluded.full_name,
          role = excluded.role,
          is_active = true,
          password_hash = excluded.password_hash,
          password_updated_at = now(),
          updated_at = now()
        returning id, email, full_name, role::text
      `,
      [email, fullName, role, passwordHash],
    );

    const user = result.rows[0];
    console.log(`Utilisateur local pret: ${user.email} (${user.role})`);
    console.log(`ID: ${user.id}`);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
