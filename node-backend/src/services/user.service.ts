import bcrypt from "bcrypt";
import { omit } from "lodash";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma-client.util";
import { LearnerType } from "../types/auth.types";

export async function createUser(input: LearnerType) {
  try {
    const salt = await bcrypt.genSalt(10);

    const hash = bcrypt.hashSync(input.password, salt);

    input.password = hash;

    const user = await prisma.learner.create({
      data: input,
    });

    return omit(user, "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

// For login
export const validatePassword = async ({
  student_id,
  password,
}: {
  student_id: string;
  password: string;
}): Promise<Omit<LearnerType, "password"> | false> => {
  const user = await prisma.learner.findFirst({
    where: {
      student_id,
    },
  });

  if (!user) {
    return false;
  }

  const isValid = await bcrypt
    .compare(password, user.password)
    .catch((e) => false);

  if (!isValid) return false;

  return omit(user, "password");
};

export async function findUser(userId: string) {
  return prisma.learner.findFirst({
    where: {
      id: userId,
    },
  });
}
