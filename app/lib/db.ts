
import { PrismaClient } from '@prisma/client';

// Singleton function to initialize Prisma Client
const prismaClientSingleton = () => {
    return new PrismaClient();
};

// Declare a global type to prevent conflicts during hot reloads in development
declare global {
    var prisma: PrismaClient | undefined;
}

// Assign Prisma Client instance to globalThis or create a new one
const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = prisma;
}

export default prisma;