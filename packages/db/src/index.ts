import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

import 'dotenv/config'

import { PrismaClient } from "../src/generated/prisma/client";

const prismaClientSingleton = () => {
  return new PrismaClient({
  adapter: new PrismaPostgresAdapter({
    connectionString: process.env.DATABASE_URL!,
  }),
})
}
type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export { prisma};

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

