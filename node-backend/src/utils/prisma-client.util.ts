import { PrismaClient } from "@prisma/client";

const environment = process.env.NODE_ENV || "development";

// add prisma to the NodeJS global type
interface CustomNodeJsGlobal extends Global {
  prisma: PrismaClient;
}

// Prevent multiple instances of Prisma Client in development
declare const global: CustomNodeJsGlobal;

const prisma = global.prisma || new PrismaClient();

if (environment === "development") global.prisma = prisma;

export default prisma;
