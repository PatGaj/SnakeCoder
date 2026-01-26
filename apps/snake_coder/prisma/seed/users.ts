import type { PrismaClient } from '../../src/generated/prisma/client'

export const seedUsers = async (prisma: PrismaClient) => {
  const defaultPasswordHash = '$2b$12$7VGr1dOA4n4LQED2OrEdkuQ9aPHVy8/0G8EhaRr25Ppexye.776j6'
  const now = Date.now()
  const recent = (minutesAgo: number) => new Date(now - minutesAgo * 60_000)

  await prisma.user.createMany({
    data: [
      {
        email: 'test@test.com',
        name: 'Test User',
        nickName: 'TheBestProgrammer',
        passwordHash: defaultPasswordHash,
        createdAt: recent(1),
      },
      {
        email: 'user1@example.com',
        xpTotal: 54,
        name: 'Adam',
        nickName: 'Potato Adam',
        passwordHash: defaultPasswordHash,
        createdAt: recent(2),
      },
      {
        email: 'user2@example.com',
        xpTotal: 62,
        name: 'Maciej',
        nickName: 'Chytry Maciej',
        passwordHash: defaultPasswordHash,
        createdAt: recent(3),
      },
      {
        email: 'user3@example.com',
        xpTotal: 13,
        name: 'Roman',
        nickName: 'Szalony Romek',
        passwordHash: defaultPasswordHash,
        createdAt: recent(4),
      },
      {
        email: 'user4@example.com',
        xpTotal: 84,
        name: 'Anna',
        nickName: 'Mała Ania',
        passwordHash: defaultPasswordHash,
        createdAt: recent(5),
      },
      {
        email: 'user5@example.com',
        xpTotal: 432,
        name: 'Eryk',
        nickName: 'Eryk Kleryk',
        passwordHash: defaultPasswordHash,
        createdAt: recent(6),
      },
      {
        email: 'user6@example.com',
        xpTotal: 43,
        name: 'Tester',
        nickName: 'TheBestTester',
        passwordHash: defaultPasswordHash,
        createdAt: recent(7),
      },
      {
        email: 'user7@example.com',
        xpTotal: 101,
        name: 'Tomasz',
        nickName: 'Wspaniały Tomek',
        passwordHash: defaultPasswordHash,
        createdAt: recent(8),
      },
      {
        email: 'user8@example.com',
        xpTotal: 22,
        name: 'Andrzej',
        nickName: 'NaImieMiAndrzej',
        passwordHash: defaultPasswordHash,
        createdAt: recent(9),
      },
      {
        email: 'user9@example.com',
        name: 'Patryk',
        nickName: 'TakiSobiePatryk',
        passwordHash: defaultPasswordHash,
        createdAt: recent(10),
      },
    ],
    skipDuplicates: true,
  })
}
