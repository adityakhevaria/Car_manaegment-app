// global.d.ts
import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;  // Declare `prisma` on the global object
}
