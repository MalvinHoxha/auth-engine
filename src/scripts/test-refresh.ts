import { register } from "../services/auth/register.service";
import { login } from "../services/auth/login.service";
import { refreshToken } from "../services/auth/refresh-token.service";

async function main() {
  console.log("=== REFRESH TEST ===");

  const email =
    `refresh-${Date.now()}@example.com`;

  const password = "Password123!";

  await register(
    "Refresh User",
    email,
    password
  );

  const loginResult =
    await login(
      email,
      password,
      "test-agent",
      "127.0.0.1"
    );

  console.log(
    "Login successful"
  );

  const refreshed =
    await refreshToken(
      loginResult.refreshToken,
      "test-agent",
      "127.0.0.1"
    );

  console.log(
    "\nNew Access Token:"
  );

  console.log(
    refreshed.accessToken
  );

  console.log("\nSUCCESS");
}

main()
  .catch(console.error)
  .finally(() =>
    process.exit(0)
  );