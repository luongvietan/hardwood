import { NextResponse } from "next/server";

import { requireAdminSession } from "@/lib/auth";
import { getResourceConfig, type ResourceKey } from "@/lib/admin/resources";
import { getRelationOptions } from "@/lib/admin/service";

export async function GET(
  _req: Request,
  context: { params: Promise<{ resource: string }> },
) {
  const session = await requireAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const params = await context.params;
  const resource = params.resource;
  const config = getResourceConfig(resource);
  if (!config) {
    return NextResponse.json({ error: "Unknown resource" }, { status: 404 });
  }
  const options = await getRelationOptions(resource as ResourceKey);
  return NextResponse.json({ options });
}
