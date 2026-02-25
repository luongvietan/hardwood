import { PrismaClient } from "@prisma/client";

import { hashPassword } from "../lib/auth";

const prisma = new PrismaClient();

async function main() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@hardwoodliving.com").toLowerCase();
  const username = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "admin123456";

  await prisma.administrator.upsert({
    where: { email },
    update: {
      username,
      passwordHash: hashPassword(password),
      role: "admin",
      isActive: true,
      description: "Seed administrator",
    },
    create: {
      email,
      username,
      passwordHash: hashPassword(password),
      role: "admin",
      isActive: true,
      description: "Seed administrator",
    },
  });

  await prisma.defaultSetting.upsert({
    where: { key: "site-title" },
    update: { value: "Hardwood Living", groupName: "website" },
    create: {
      key: "site-title",
      value: "Hardwood Living",
      groupName: "website",
      description: "Main site title",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
