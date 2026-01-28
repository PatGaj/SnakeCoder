import { PrismaClient } from "../generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";

// Postgres adapter used by Prisma to talk to the database via DATABASE_URL.
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

// Global singleton for Prisma client in dev to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });

// Cache the client in development to reuse it across HMR reloads.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
