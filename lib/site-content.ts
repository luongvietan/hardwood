import { prisma, safeDbCall } from "@/lib/db";

export async function getDefaultSettingsMap() {
  const settings = await safeDbCall([], async () =>
    prisma.defaultSetting.findMany({
      orderBy: [{ groupName: "asc" }, { key: "asc" }],
    }),
  );

  return settings.reduce<Record<string, string>>((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});
}
