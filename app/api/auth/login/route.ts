import { NextRequest, NextResponse } from "next/server";

import { createAdminSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const admin = await prisma.administrator.findUnique({ where: { email } });
  if (!admin || !admin.isActive) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }
  const ok = verifyPassword(password, admin.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  await prisma.administrator.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });
  await createAdminSession(admin.id, admin.email, admin.role);
  return NextResponse.json({ ok: true });
}
