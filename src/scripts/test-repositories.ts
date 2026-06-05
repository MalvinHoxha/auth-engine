import { userRepository } from "../repositories/user.repository";
import { sessionRepository } from "../repositories/session.repository";
import { auditRepository } from "../repositories/audit.repository";
import { AuditAction } from "../../generated/prisma/client";

async function main() {
  console.log("=== USER TEST ===");

  const user = await userRepository.create({
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    passwordHash: "fake-hash",
  });

  console.log("Created user:", user);

  const foundUser = await userRepository.findByEmail(
    user.email
  );

  console.log("Found user:", foundUser);

  await userRepository.incrementLoginAttempts(
    user.id
  );

  const updatedUser = await userRepository.findById(
    user.id
  );

  console.log(
    "Login attempts:",
    updatedUser?.loginAttempts
  );

  console.log("\n=== SESSION TEST ===");

  const session = await sessionRepository.create({
    userId: user.id,
    refreshTokenHash: "refresh-token-hash",
    expiresAt: new Date(
      Date.now() + 1000 * 60 * 60 * 24
    ),
    userAgent: "test-agent",
    ipAddress: "127.0.0.1",
  });

  console.log("Created session:", session);

  const activeSessions =
    await sessionRepository.findActiveUserSessions(
      user.id
    );

  console.log(
    "Active sessions:",
    activeSessions.length
  );

  console.log("\n=== AUDIT TEST ===");

  const audit = await auditRepository.create({
    userId: user.id,
    action: AuditAction.REGISTER,
    ipAddress: "127.0.0.1",
    userAgent: "test-agent",
  });

  console.log("Audit log:", audit);

  const audits =
    await auditRepository.findByUserId(user.id);

  console.log(
    "User audit logs:",
    audits.length
  );

  console.log("\n=== CLEANUP ===");

  await userRepository.delete(user.id);

  console.log("User deleted");
}

main()
  .then(() => {
    console.log("\nSUCCESS");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });