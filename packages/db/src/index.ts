import {  PrismaClient } from "../src/generated/prisma/client";
import { PrismaPostgresAdapter } from "@prisma/adapter-ppg";

// Instantiate your runtime variable (lowercase)
const prisma = new PrismaClient({
  adapter: new PrismaPostgresAdapter({
    connectionString: process.env.DATABASE_URL!,
  }),
});


export { prisma}