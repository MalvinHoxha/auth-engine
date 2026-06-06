import { userRepository } from "../../repositories/user.repository";
import { auditRepository } from "../../repositories/audit.repository";

import { hashPassword } from "../../utils/password";
import { AuditAction } from "../../../generated/prisma/client";

export async function register(
  name: string,
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
) {
  const existingUser =
    await userRepository.findByEmail(email);

  if (existingUser) {
    throw new Error(
      "Email already registered"
    );
  }

  const passwordHash =
    await hashPassword(password);

  const user =
    await userRepository.create({
      name,
      email,
      passwordHash,
    });

  await auditRepository.create({
  userId: user.id,
  action: AuditAction.REGISTER,

  ...(userAgent && {
    userAgent,
  }),

  ...(ipAddress && {
    ipAddress,
  }),
});

  return user;
}