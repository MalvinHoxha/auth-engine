import { register } from "../services/auth/register.service";
import { login } from "../services/auth/login.service";
import { logoutAllSessions } from "../services/auth/logout-all.service";
import { sessionRepository } from "../repositories/session.repository";

async function main() {
  console.log("=== LOGOUT ALL TEST ===");

  const email =
    `logoutall-${Date.now()}@example.com`;

  const password = "Password123!";

  const user = await register(
    "Logout All User",
    email,
    password
  );

  await login(
    email,
    password,
    "Chrome",
    "127.0.0.1"
  );

  await login(
    email,
    password,
    "Firefox",
    "127.0.0.1"
  );

  await login(
    email,
    password,
    "Safari",
    "127.0.0.1"
  );

  const before =
    await sessionRepository.findActiveUserSessions(
      user.id
    );

  console.log(
    "Active sessions before:",
    before.length
  );

  await logoutAllSessions(
    user.id,
    "test-agent",
    "127.0.0.1"
  );

  const after =
    await sessionRepository.findActiveUserSessions(
      user.id
    );

  console.log(
    "Active sessions after:",
    after.length
  );

  console.log("\nSUCCESS");
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));