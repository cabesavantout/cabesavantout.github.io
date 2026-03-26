import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { E2E_USER } from "./test-credentials";

function loadEnvFile(filePath: string) {
  const content = readFileSync(filePath, "utf8");
  const values: Record<string, string> = {};

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

export default async function globalSetup() {
  const projectRoot = process.cwd();
  const envPath = join(projectRoot, ".env.local");
  const envValues = loadEnvFile(envPath);
  const dsn = envValues.DATABASE_URL;

  if (!dsn) {
    throw new Error("DATABASE_URL manquant dans apps/team-app/.env.local");
  }

  execFileSync(
    "node",
    [
      join(projectRoot, "scripts", "create_local_auth_user.mjs"),
      "--dsn",
      dsn,
      "--email",
      E2E_USER.email,
      "--password",
      E2E_USER.password,
      "--name",
      E2E_USER.name,
      "--role",
      E2E_USER.role,
    ],
    {
      cwd: projectRoot,
      stdio: "pipe",
    },
  );
}
