import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ADMIN_RESOURCES, type AdminResource, type ResourceKey } from "@/lib/admin/resources";

const PROTECTED_PAGE_SLUGS = new Set(["store"]);

type Primitive = string | number | boolean | null | string[];

type QueryRecord = Record<string, Primitive>;

type ModelClient = {
  findMany: (args?: Record<string, unknown>) => Promise<Array<Record<string, unknown>>>;
  findUnique: (args: Record<string, unknown>) => Promise<Record<string, unknown> | null>;
  create: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  update: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
  delete: (args: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

const prismaClient = prisma as unknown as Record<string, ModelClient>;

function toBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value === "true" || value === "1" || value === "on";
  }
  return Boolean(value);
}

function normalizeValue(type: string, value: unknown): Primitive {
  if (value === undefined) {
    return null;
  }
  if (type === "imageList") {
    if (value === null || value === "") {
      return [];
    }
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).filter((item) => item.trim().length > 0);
    }
    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        if (Array.isArray(parsed)) {
          return parsed.map((item) => String(item)).filter((item) => item.trim().length > 0);
        }
      } catch {
        // ignore JSON parse
      }
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
    return [];
  }
  if (value === null || value === "") {
    return null;
  }
  if (type === "boolean") {
    return toBoolean(value);
  }
  if (type === "number") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  if (type === "date") {
    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }
  return String(value);
}

function relationFieldKey(fieldKey: string) {
  if (fieldKey.endsWith("Id") && fieldKey.length > 2) {
    return fieldKey.slice(0, -2);
  }
  return fieldKey;
}

function buildData(resource: ResourceKey, input: QueryRecord, mode: "create" | "update") {
  const config = ADMIN_RESOURCES[resource];
  const data: Record<string, unknown> = {};
  for (const field of config.fields) {
    const raw = input[field.key];
    if (raw === undefined) {
      continue;
    }
    if (field.key === "passwordHash") {
      const rawPassword = String(raw).trim();
      if (rawPassword) {
        data.passwordHash = hashPassword(rawPassword);
      }
      continue;
    }
    const value = normalizeValue(field.type, raw);
    if (field.relationResource) {
      const relationKey = relationFieldKey(field.key);
      if (value === null) {
        if (mode === "update") {
          data[relationKey] = { disconnect: true };
        }
        continue;
      }
      data[relationKey] = { connect: { id: value } };
      continue;
    }
    data[field.key] = value;
  }
  return data;
}

export async function listResource(resource: ResourceKey, query: URLSearchParams) {
  const config: AdminResource = ADMIN_RESOURCES[resource];
  const model = prismaClient[config.model];
  if (!model) {
    return [];
  }

  const search = query.get("search")?.trim();
  const where: Record<string, unknown> = {};
  if (search) {
    const searchFields = config.fields.filter((x) => x.type === "text" || x.type === "email");
    if (searchFields.length) {
      where.OR = searchFields.map((field) => ({
        [field.key]: {
          contains: search,
          mode: "insensitive",
        },
      }));
    }
  }

  const items = await model.findMany({
    where,
    orderBy: config.defaultOrderBy ?? { createdAt: "desc" },
  });
  return items;
}

export async function getResourceById(resource: ResourceKey, id: string) {
  const config: AdminResource = ADMIN_RESOURCES[resource];
  const model = prismaClient[config.model];
  if (!model) {
    return null;
  }
  return model.findUnique({ where: { id } });
}

export async function createResource(resource: ResourceKey, input: QueryRecord) {
  const config: AdminResource = ADMIN_RESOURCES[resource];
  const model = prismaClient[config.model];
  if (!model) {
    return null;
  }
  const data = buildData(resource, input, "create");
  return model.create({ data });
}

export async function updateResource(resource: ResourceKey, id: string, input: QueryRecord) {
  const config: AdminResource = ADMIN_RESOURCES[resource];
  const model = prismaClient[config.model];
  if (!model) {
    return null;
  }
  const data = buildData(resource, input, "update");
  return model.update({ where: { id }, data });
}

export async function deleteResource(resource: ResourceKey, id: string) {
  const config: AdminResource = ADMIN_RESOURCES[resource];
  const model = prismaClient[config.model];
  if (!model) {
    return null;
  }
  if (resource === "pages-structure") {
    const page = await prisma.pageStructure.findUnique({
      where: { id },
      select: { slug: true },
    });
    const slug = page?.slug?.replace(/^\//, "") ?? "";
    if (PROTECTED_PAGE_SLUGS.has(slug)) {
      return null;
    }
  }
  return model.delete({ where: { id } });
}

export async function getRelationOptions(resource: ResourceKey) {
  const config: AdminResource = ADMIN_RESOURCES[resource];
  const results: Record<string, Array<{ value: string; label: string }>> = {};

  for (const field of config.fields) {
    if (!field.relationResource) {
      continue;
    }
    const relationKey = field.relationResource as ResourceKey;
    const relationConfig = ADMIN_RESOURCES[relationKey] as AdminResource;
    if (!relationConfig) {
      results[field.key] = [];
      continue;
    }
    const model = prismaClient[relationConfig.model];
    if (!model) {
      results[field.key] = [];
      continue;
    }
    const items = await model.findMany({
      orderBy: relationConfig.defaultOrderBy ?? { createdAt: "desc" },
      take: 500,
    });
    const labelKey =
      relationConfig.fields.find((x) => x.key === "name" || x.key === "title" || x.key === "username")
        ?.key ?? "id";
    results[field.key] = items.map((item: Record<string, unknown>) => ({
      value: String(item.id),
      label: String(item[labelKey] ?? item.id),
    }));
  }

  return results;
}
