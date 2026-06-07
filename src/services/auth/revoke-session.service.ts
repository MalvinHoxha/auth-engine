import { sessionRepository } from "../../repositories/session.repository";
import { auditRepository } from "../../repositories/audit.repository";

import { AuditAction } from "../../../generated/prisma/client";

export async function revokeSession(
  userId: string,
  sessionId: string,
  userAgent?: string,
  ipAddress?: string
) {
  const session =
    await sessionRepository.findById(
      sessionId
    );

  if (!session) {
    throw new Error(
      "Session not found"
    );
  }

  if (session.userId !== userId) {
    throw new Error(
      "Unauthorized"
    );
  }

  await sessionRepository.revokeSession(
    sessionId
  );

  await auditRepository.create({
    userId,
    action:
      AuditAction.LOGOUT,

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