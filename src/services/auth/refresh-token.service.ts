import { sessionRepository } from "../../repositories/session.repository";
import { userRepository } from "../../repositories/user.repository";
import { auditRepository } from "../../repositories/audit.repository";

import {
  verifyRefreshToken,
  generateAccessToken,
} from "../../utils/jwt";

import { AuditAction } from "../../../generated/prisma/client";

export async function refreshToken(
  refreshToken: string,
  userAgent?: string,
  ipAddress?: string
) {
  const payload =
    verifyRefreshToken(refreshToken) as {
      userId: string;
    };

  const session =
    await sessionRepository.findByRefreshTokenHash(
      refreshToken
    );

  if (!session) {
    throw new Error(
      "Invalid refresh token"
    );
  }

  if (session.revoked) {
    throw new Error(
      "Session revoked"
    );
  }

  if (
    session.expiresAt < new Date()
  ) {
    throw new Error(
      "Refresh token expired"
    );
  }

  const user =
    await userRepository.findById(
      payload.userId
    );

  if (!user) {
    throw new Error(
      "User not found"
    );
  }

  const accessToken =
    generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

  await sessionRepository.updateLastUsed(
    session.id
  );

  await auditRepository.create({
    userId: user.id,
    action: AuditAction.TOKEN_REFRESH,

    ...(userAgent && {
      userAgent,
    }),

    ...(ipAddress && {
      ipAddress,
    }),
  });

  return {
    accessToken,
  };
}