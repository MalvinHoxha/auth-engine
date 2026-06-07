import { register } from "../services/auth/register.service";
import { login } from "../services/auth/login.service";
import { listActiveSessions } from "../services/auth/list-active-sessions.service";

async function main() {
  console.log(
    "=== LIST ACTIVE SESSIONS TEST ==="
  );

  const email =
    `sessions-${Date.now()}@example.com`;

  const password = "Password123!";

  const user = await register(
    "Sessions User",
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

  const sessions =
    await listActiveSessions(
      user.id
    );

  console.log(
    JSON.stringify(
      sessions,
      null,
      2
    )
  );

  console.log(
    `\nFound ${sessions.length} sessions`
  );
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));