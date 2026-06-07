import "dotenv/config";

import { register } from "../services/auth/register.service";
import { login } from "../services/auth/login.service";

async function main() {
  console.log("=== LOGIN TEST ===");

  const email = `login-${Date.now()}@example.com`;
  const password = "Password123!";

  await register(
    "Login User",
    email,
    password
  );

  const result = await login(
    email,
    password,
    "test-agent",
    "127.0.0.1"
  );

  console.log("\nUser:");
  console.log(result.user);

  console.log("\nAccess Token:");
  console.log(result.accessToken);

  console.log("\nRefresh Token:");
  console.log(result.refreshToken);

  console.log("\nSUCCESS");
}

main().catch(console.error);