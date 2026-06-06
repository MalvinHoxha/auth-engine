

import {
  generateAccessToken,
  verifyAccessToken,
} from "../utils/jwt";

const token = generateAccessToken({
  userId: "123",
  email: "test@test.com",
  role: "USER",
});

console.log(token);

const decoded =
  verifyAccessToken(token);

console.log(decoded);