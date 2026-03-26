import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getPool } from "@/lib/postgres";

const LOCAL_AUTH_COOKIE = "cabes_local_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const DEV_AUTH_SECRET = "cabestany-dev-local-auth-secret";

type SessionPayload = {
  userId: string;
  exp: number;
};

type LocalAuthRow = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  password_hash: string | null;
};

export type LocalAuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

export function isSuperadmin(user: LocalAuthUser | null) {
  return user?.role === "superadmin";
}

export class LocalAuthSchemaError extends Error {
  constructor(message = "Le schema d'auth locale n'est pas initialise.") {
    super(message);
    this.name = "LocalAuthSchemaError";
  }
}

function getAuthSecret() {
  return process.env.AUTH_SECRET || DEV_AUTH_SECRET;
}

function toBase64Url(input: string | Buffer) {
  return Buffer.from(input).toString("base64url");
}

function fromBase64Url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(input: string) {
  return createHmac("sha256", getAuthSecret()).update(input).digest("base64url");
}

function encodeSession(payload: SessionPayload) {
  const body = toBase64Url(JSON.stringify(payload));
  const signature = sign(body);
  return `${body}.${signature}`;
}

function decodeSession(token: string): SessionPayload | null {
  const [body, signature] = token.split(".");

  if (!body || !signature) {
    return null;
  }

  const expected = sign(body);
  const expectedBuffer = Buffer.from(expected);
  const signatureBuffer = Buffer.from(signature);

  if (
    expectedBuffer.length !== signatureBuffer.length ||
    !timingSafeEqual(expectedBuffer, signatureBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(fromBase64Url(body)) as SessionPayload;

    if (!payload.userId || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  return `scrypt$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [algorithm, salt, expectedHash] = storedHash.split("$");

  if (algorithm !== "scrypt" || !salt || !expectedHash) {
    return false;
  }

  const derivedKey = scryptSync(password, salt, 64).toString("hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const derivedBuffer = Buffer.from(derivedKey, "hex");

  if (expectedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return timingSafeEqual(expectedBuffer, derivedBuffer);
}

async function queryUserByEmail(email: string) {
  try {
    const db = getPool();
    const { rows } = await db.query<LocalAuthRow>(
      `
        select id, email, full_name, role::text, is_active, password_hash
        from users
        where lower(email) = lower($1)
        limit 1
      `,
      [email],
    );

    return rows[0] ?? null;
  } catch (error) {
    if (error instanceof Error && /password_hash/.test(error.message)) {
      throw new LocalAuthSchemaError();
    }

    throw error;
  }
}

async function queryUserById(userId: string) {
  try {
    const db = getPool();
    const { rows } = await db.query<LocalAuthRow>(
      `
        select id, email, full_name, role::text, is_active, password_hash
        from users
        where id = $1
        limit 1
      `,
      [userId],
    );

    return rows[0] ?? null;
  } catch (error) {
    if (error instanceof Error && /password_hash/.test(error.message)) {
      throw new LocalAuthSchemaError();
    }

    throw error;
  }
}

function toLocalAuthUser(row: LocalAuthRow): LocalAuthUser {
  return {
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
  };
}

export async function authenticateLocalUser(email: string, password: string) {
  const user = await queryUserByEmail(email);

  if (!user || !user.is_active || !user.password_hash) {
    return null;
  }

  return verifyPassword(password, user.password_hash) ? toLocalAuthUser(user) : null;
}

export async function getLocalAuthUserFromSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(LOCAL_AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const payload = decodeSession(token);

  if (!payload) {
    return null;
  }

  const user = await queryUserById(payload.userId);

  if (!user || !user.is_active || !user.password_hash) {
    return null;
  }

  return toLocalAuthUser(user);
}

export async function createLocalAuthSession(user: LocalAuthUser) {
  const cookieStore = await cookies();
  const token = encodeSession({
    userId: user.id,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  });

  cookieStore.set(LOCAL_AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearLocalAuthSession() {
  const cookieStore = await cookies();
  cookieStore.delete(LOCAL_AUTH_COOKIE);
}
