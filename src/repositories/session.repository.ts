import { prisma } from "../database/prisma";

export const sessionRepository = {
  async create(data: {
    userId: string;
    refreshTokenHash: string;
    userAgent?: string;
    ipAddress?: string;
    expiresAt: Date;
  }) {
    return prisma.session.create({
      data,
    });
  },

  async findById(id: string) {
    return prisma.session.findUnique({
      where: { id },
    });
  },

  async updateLastUsed(id: string) {
    return prisma.session.update({
      where: { id },
      data: {
        lastUsedAt: new Date(),
      },
    });
  },

  async revoke(id: string) {
    return prisma.session.update({
      where: { id },
      data: {
        revoked: true,
        revokedAt: new Date(),
      },
    });
  },

  async revokeAllUserSessions(
    userId: string
  ) {
    return prisma.session.updateMany({
      where: {
        userId,
        revoked: false,
      },
      data: {
        revoked: true,
        revokedAt: new Date(),
      },
    });
  },



  async findActiveUserSessions(
    userId: string
  ) {
    return prisma.session.findMany({
      where: {
        userId,
        revoked: false,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        lastUsedAt: "desc",
      },
    });
  },

  async findByRefreshTokenHash(
    refreshTokenHash: string
  ) {
    return prisma.session.findUnique({
      where: {
        refreshTokenHash,
      },
    });
  },
};

