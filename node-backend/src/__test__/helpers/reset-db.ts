import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async () => {
  await prisma.$transaction([
    prisma.tutorial.update({
      where: {
        id: "cm2t9zngh0005dezcj1pq8bd8",
      },
      data: {
        status: "generated",
      },
    }),
  ]);
};
