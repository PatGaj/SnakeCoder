import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient, Prisma } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Alice",
    email: "alice@gmail.com",
    opinion: {
      create: [
        {
          rate: 5,
          title: "Very good App",
          content: "It's my favorite app",
        },
        {
          rate: 5,
          title: "Super",
          content: "I love this app",
        },
      ],
    },
  },
  {
    name: "Bob",
    email: "bob@gmail.com",
    opinion: {
      create: [
        {
          rate: 5,
          title: "Super Mega",
          content: "Super aplikacja",
        },
      ],
    },
  },
];

export async function main() {
  const plainPassword = "Test1234!";
  const passwordHash = await bcrypt.hash(plainPassword, 12);

  for (const u of userData) {
    await prisma.user.create({
      data: {
        ...u,
        passwordHash,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
