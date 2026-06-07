import { userRepository } from "../../repositories/user.repository";
import { sessionRepository } from "../../repositories/session.repository";
import { auditRepository } from "../../repositories/audit.repository";
import { verifyPassword } from "../../utils/password";
import { AuditAction } from "../../../generated/prisma/client";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../utils/jwt";

export async function login(
  email: string,
  password: string,
  userAgent?: string,
  ipAddress?: string
) {
  const user = await userRepository.findByEmail(
    email
  );

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (
    user.lockUntil &&
    user.lockUntil > new Date()
  ) {
    throw new Error(
      "Account temporarily locked"
    );
  }

  const validPassword =
    await verifyPassword(
      user.passwordHash,
      password
    );

  if (!validPassword) {
    await userRepository.incrementLoginAttempts(
      user.id
    );

    throw new Error("Invalid credentials");
  }

  await userRepository.resetLoginAttempts(
    user.id
  );

  const accessToken =
  generateAccessToken({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

const refreshToken =
  generateRefreshToken({
    userId: user.id,
  });

  const expiresAt = new Date(
    Date.now() +
      7 * 24 * 60 * 60 * 1000
  );

    await sessionRepository.create({
        userId: user.id,
        refreshTokenHash: refreshToken,
        expiresAt,

        ...(userAgent && {
            userAgent,
        }),

        ...(ipAddress && {
            ipAddress,
        }),
        });

        await auditRepository.create({
          userId: user.id,
          action: AuditAction.LOGIN_SUCCESS,

          ...(userAgent && {
            userAgent,
          }),

          ...(ipAddress && {
            ipAddress,
          }),
        });

        return {
            accessToken,
            refreshToken,
            user,
    };

 
}