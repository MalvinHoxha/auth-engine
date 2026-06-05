import { prisma } from "../database/prisma";

import { AuditAction } from "../../generated/prisma/client";

export const auditRepository = {
  async create(data: {
    userId?: string;
    action: AuditAction;
    ipAddress?: string;
    userAgent?: string;
    metadata?: unknown;
  }) {
    return prisma.auditLog.create({
      data: {
        action: data.action,

        ...(data.userId && {
          userId: data.userId,
        }),

        ...(data.ipAddress && {
          ipAddress: data.ipAddress,
        }),

        ...(data.userAgent && {
          userAgent: data.userAgent,
        }),
      },
    });
  },

  async findByUserId(userId: string) {
    return prisma.auditLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  async findRecent(limit = 100) {
    return prisma.auditLog.findMany({
      take: limit,
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};