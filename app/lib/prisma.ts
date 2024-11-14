// app/lib/prisma.ts
import { PrismaClient } from '@prisma/client'

declare global {
  // Declaring prisma on the global namespace in development
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient
    }
  }
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // Avoid using `any` by defining `prisma` on the global object
  if (!global.prisma) {
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export { prisma }
