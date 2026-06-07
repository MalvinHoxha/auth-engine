import { register } from "../services/auth/register.service";
import { login } from "../services/auth/login.service";
import { logout } from "../services/auth/logout.service";

async function main() {
  console.log("=== LOGOUT TEST ===");

  const email =
    `logout-${Date.now()}@example.com`;

  const password = "Password123!";

  await register(
    "Logout User",
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

  const result =
    await logout(
      loginResult.refreshToken,
      "test-agent",
      "127.0.0.1"
    );

  console.log(result);

  console.log("\nSUCCESS");
}

main()
  .catch(console.error)
  .finally(() =>
    process.exit(0)
  );