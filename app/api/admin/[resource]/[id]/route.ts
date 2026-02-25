import { NextRequest, NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth";
import { getResourceConfig, type ResourceKey } from "@/lib/admin/resources";
import { deleteResource, getResourceById, updateResource } from "@/lib/admin/service";

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> },
) {
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
  const item = await getResourceById(resource as ResourceKey, params.id);
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ item });
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> },
) {
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
  const item = await updateResource(resource as ResourceKey, params.id, body);
  return NextResponse.json({ item });
}

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ resource: string; id: string }> },
) {
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
  await deleteResource(resource as ResourceKey, params.id);
  return NextResponse.json({ ok: true });
}
