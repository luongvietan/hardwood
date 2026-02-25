import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth";
import { getResourceConfig, type ResourceKey } from "@/lib/admin/resources";
import { createResource, listResource } from "@/lib/admin/service";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest, context: { params: Promise<{ resource: string }> }) {
  const session = await requireAdminSession();
  if (!session) {
    return unauthorized();
  }

  const params = await context.params;
  const resource = params.resource;
  const config = getResourceConfig(resource);
  if (!config) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  const items = await listResource(resource as ResourceKey, req.nextUrl.searchParams);
  return NextResponse.json({ items });
}

export async function POST(req: NextRequest, context: { params: Promise<{ resource: string }> }) {
  const session = await requireAdminSession();
  if (!session) {
    return unauthorized();
  }

  const params = await context.params;
  const resource = params.resource;
  const config = getResourceConfig(resource);
  if (!config) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }

  const body = (await req.json()) as Record<string, string | number | boolean | null>;
  const created = await createResource(resource as ResourceKey, body);
  return NextResponse.json({ item: created });
}
