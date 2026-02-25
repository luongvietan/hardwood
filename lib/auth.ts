import { createHash, randomBytes, timingSafeEqual } from "crypto";

import { cookies } from "next/headers";

import { prisma } from "@/lib/db";

const AUTH_COOKIE = "hl_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

type SessionPayload = {
  adminId: string;
  email: string;
  role: string;
  exp: number;
};

function hash(input: string) {
  return createHash("sha256").update(input).digest("hex");
}

export function hashPassword(raw: string) {
  const salt = randomBytes(16).toString("hex");
  const digest = hash(`${salt}:${raw}`);
  return `${salt}:${digest}`;
}

export function verifyPassword(raw: string, stored: string) {
  const [salt, digest] = stored.split(":");
  if (!salt || !digest) {
    return false;
  }
  const compared = hash(`${salt}:${raw}`);
  const left = Buffer.from(digest, "hex");
  const right = Buffer.from(compared, "hex");
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

function encode(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
}

function decode(raw?: string): SessionPayload | null {
  if (!raw) {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(raw, "base64url").toString("utf8")) as SessionPayload;
    if (!parsed.adminId || !parsed.email || !parsed.role || !parsed.exp) {
      return null;
    }
    if (parsed.exp < Date.now()) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function createAdminSession(adminId: string, email: string, role: string) {
  const exp = Date.now() + SESSION_TTL_SECONDS * 1000;
  const payload = encode({ adminId, email, role, exp });
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, payload, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}

export async function getSession() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE)?.value;
  return decode(raw);
}

export async function requireAdminSession() {
  const session = await getSession();
  if (!session) {
    return null;
  }
  const admin = await prisma.administrator.findUnique({
    where: { id: session.adminId },
    select: {
      id: true,
      email: true,
      username: true,
      role: true,
      isActive: true,
    },
  });
  if (!admin || !admin.isActive) {
    return null;
  }
  return admin;
}
