import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { createAdminSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  if (!process.env.DATABASE_URL) {
    return NextResponse.json(
      { error: "Server is missing DATABASE_URL configuration" },
      { status: 503 },
    );
  }

  const body = (await req.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password ?? "";
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
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
  } catch (error) {
    if (error instanceof Prisma.PrismaClientInitializationError) {
      return NextResponse.json(
        { error: "Database is unavailable. Please try again later." },
        { status: 503 },
      );
    }
    throw error;
  }
}
