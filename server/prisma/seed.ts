import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      name: "John Doe",
      email: "johndoe@gmail.com",
      avatarUrl: "https://github.com/guilhermesc-6.png",
    },
  });

  const pool = await prisma.pool.create({
    data: {
      title: "Example pool",
      code: "BOL123",
      ownerId: user.id,

      participants: {
        create: {
          userId: user.id,
        },
      },
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-05T12:20:00.771Z",
      firstTeamCountryCode: "PT",
      secondTeamContryCode: "BR",
    },
  });

  await prisma.game.create({
    data: {
      date: "2022-11-06T12:20:00.771Z",
      firstTeamCountryCode: "UK",
      secondTeamContryCode: "US",

      guesses: {
        create: {
          firstTeamPoints: 3,
          secondTeamPoints: 1,

          participants: {
            connect: {
              userId_poolId: {
                userId: user.id,
                poolId: pool.id,
              },
            },
          },
        },
      },
    },
  });
}

main();
