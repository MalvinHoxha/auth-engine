import { sessionRepository } from "../../repositories/session.repository";

export async function listActiveSessions(
  userId: string
) {
  const sessions =
    await sessionRepository.findActiveUserSessions(
      userId
    );

  return sessions.map((session) => ({
    id: session.id,
    userAgent: session.userAgent,
    ipAddress: session.ipAddress,
    createdAt: session.createdAt,
    lastUsedAt: session.lastUsedAt,
    expiresAt: session.expiresAt,
  }));
}