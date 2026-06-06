import "dotenv/config";

import { register } from "../services/auth/register.service";
import { prisma } from "../database/prisma";

async function main() {
  const email = `john-${Date.now()}@example.com`;

  console.log("=== REGISTER TEST ===");

  const user = await register(
    "John Doe",
    email,
    "Password123!",
    "test-agent",
    "127.0.0.1"
  );

  console.log("Created user:");
  console.log(user);

  const auditLogs =
    await prisma.auditLog.findMany({
      where: {
        userId: user.id,
      },
    });

  console.log(
    "Audit logs found:",
    auditLogs.length
  );

  console.log(
    "Password hash starts with:",
    user.passwordHash.slice(0, 20)
  );

  console.log("SUCCESS");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });