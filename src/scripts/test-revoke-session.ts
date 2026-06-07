import { register } from "../services/auth/register.service";
import { login } from "../services/auth/login.service";

import { listActiveSessions } from "../services/auth/list-active-sessions.service";

import { revokeSession } from "../services/auth/revoke-session.service";

async function main() {
  console.log(
    "=== REVOKE SESSION TEST ==="
  );

  const email =
    `revoke-${Date.now()}@example.com`;

  const password =
    "Password123!";

  const user =
    await register(
      "Revoke User",
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

  const before =
    await listActiveSessions(
      user.id
    );

  console.log(
    "Before:",
    before.length
  );

    const sessionToRevoke = before[0];

    if (!sessionToRevoke) {
    throw new Error("No sessions found");
    }

    await revokeSession(
    user.id,
    sessionToRevoke.id
    );

  const after =
    await listActiveSessions(
      user.id
    );

  console.log(
    "After:",
    after.length
  );

  console.log(after);
}

main()
  .catch(console.error)
  .finally(() => process.exit(0));