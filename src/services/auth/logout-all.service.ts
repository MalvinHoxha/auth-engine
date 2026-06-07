import { sessionRepository } from "../../repositories/session.repository";
import { auditRepository } from "../../repositories/audit.repository";

import { AuditAction } from "../../../generated/prisma/client";

export async function logoutAllSessions(
  userId: string,
  userAgent?: string,
  ipAddress?: string
) {
  await sessionRepository.revokeAllUserSessions(
    userId
  );

  await auditRepository.create({
    userId,
    action: AuditAction.LOGOUT_ALL,

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