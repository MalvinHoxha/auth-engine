import { prisma } from "../database/prisma";

export const userRepository = {
  async create(data: {
    name: string;
    email: string;
    passwordHash: string;
  }) {
    return prisma.user.create({
      data,
    });
  },

  async findById(id: string) {
    return prisma.user.findUnique({
      where: { id },
    });
  },

  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async update(id: string, data: Partial<{
    name: string;
    passwordHash: string;
    emailVerifiedAt: Date;
    loginAttempts: number;
    lockUntil: Date | null;
  }>) {
    return prisma.user.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.user.delete({
      where: { id },
    });
  },

  async incrementLoginAttempts(id: string) {
        return prisma.user.update({
            where: { id },
            data: {
            loginAttempts: {
                increment: 1,
            },
            },
        });
    },

    async resetLoginAttempts(id: string) {
        return prisma.user.update({
            where: { id },
            data: {
            loginAttempts: 0,
            lockUntil: null,
            },
        });
    },

    async lockAccount(
        id: string,
        lockUntil: Date
        ) {
        return prisma.user.update({
            where: { id },
            data: {
            lockUntil,
            },
        });
    },
};

/*
    userRepository.create()
    userRepository.findById()
    userRepository.findByEmail()
    userRepository.update()
    userRepository.delete()

    userRepository.incrementLoginAttempts()
    userRepository.resetLoginAttempts()
    userRepository.lockAccount()
*/