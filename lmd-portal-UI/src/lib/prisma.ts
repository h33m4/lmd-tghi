import "dotenv/config";
import dotenv from "dotenv";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

dotenv.config({ path: ".env.local" });

const globalForPrisma = globalThis as unknown as {
  prismaWriter: PrismaClient | undefined;
  prismaReader: PrismaClient | undefined;
};

/**
 * WRITER Instance (Primary Database)
 */
const writerConnectionString = process.env.DATABASE_URL!;
const writerAdapter = new PrismaPg({
  connectionString: writerConnectionString,
});

export const prismaWriter =
  globalForPrisma.prismaWriter ?? new PrismaClient({ adapter: writerAdapter });

/**
 * READER Instance (Read Replica)
 */
const readerConnectionString =
  process.env.DATABASE_URL_READER || process.env.DATABASE_URL!;
const readerAdapter = new PrismaPg({
  connectionString: readerConnectionString,
});

export const prismaReader =
  globalForPrisma.prismaReader ?? new PrismaClient({ adapter: readerAdapter });

// Cache in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaWriter = prismaWriter;
  globalForPrisma.prismaReader = prismaReader;
}

// Backward compatibility
export const prisma = prismaWriter;
export default prismaWriter;
