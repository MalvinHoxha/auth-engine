import { sessionRepository } from "../../repositories/session.repository";
import { auditRepository } from "../../repositories/audit.repository";

import { verifyRefreshToken } from "../../utils/jwt";

import { AuditAction } from "../../../generated/prisma/client";

export async function logout(
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
      "Session not found"
    );
  }

  if (session.revoked) {
    throw new Error(
      "Session already revoked"
    );
  }

  await sessionRepository.revoke(
    session.id
  );

  await auditRepository.create({
    userId: payload.userId,
    action: AuditAction.LOGOUT,

    ...(userAgent && {
      userAgent,
    }),

    ...(ipAddress && {
      ipAddress,
    }),
  });

  return {
    success: true,
  };
}