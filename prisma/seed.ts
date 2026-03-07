import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const adminPassword = await bcrypt.hash("admin123", 12);
  const userPassword = await bcrypt.hash("user123", 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password: adminPassword,
      role: Role.ADMIN,
      isActive: true,
    },
  });

  console.log(`Created admin: ${admin.email}`);

  // Create regular users
  const users = [
    { name: "Alice Johnson", email: "alice@example.com", role: Role.USER },
    { name: "Bob Smith", email: "bob@example.com", role: Role.USER },
    { name: "Carol Williams", email: "carol@example.com", role: Role.ADMIN },
    { name: "David Brown", email: "david@example.com", role: Role.USER, isActive: false },
    { name: "Eve Davis", email: "eve@example.com", role: Role.USER },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: userPassword,
        isActive: userData.isActive ?? true,
      },
    });
    console.log(`Created user: ${user.email}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
