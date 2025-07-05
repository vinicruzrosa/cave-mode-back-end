import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export const setupTestDatabase = async () => {
  // Limpa todas as tabelas antes dos testes
  await prisma.blockedApp.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.alarm.deleteMany();
  await prisma.routine.deleteMany();
  await prisma.user.deleteMany();
};

export const teardownTestDatabase = async () => {
  await prisma.$disconnect();
};

export { prisma }; 