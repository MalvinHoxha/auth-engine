import { AuditAction } from "../../generated/prisma/client";

import { auditRepository } from "../repositories/audit.repository";
import { userRepository } from "../repositories/user.repository";

import { hashPassword } from "../utils/password";

export const authService = {
  async register(data: {
    name: string;
    email: string;
    password: string;
  }) {
    const existingUser =
      await userRepository.findByEmail(
        data.email
      );

    if (existingUser) {
      throw new Error(
        "User already exists"
      );
    }

    const passwordHash =
      await hashPassword(
        data.password
      );

    const user =
      await userRepository.create({
        name: data.name,
        email: data.email,
        passwordHash,
      });

    await auditRepository.create({
      userId: user.id,
      action: AuditAction.REGISTER,
    });

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  },
};