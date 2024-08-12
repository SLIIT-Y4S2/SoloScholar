import bcrypt from "bcrypt";
import { omit } from "lodash";
import { Prisma } from "@prisma/client";
import prisma from "../utils/prisma-client.util";
import { PersonCreateInput, PersonType } from "../types/auth.types";

export async function createUser(
  input: PersonCreateInput,
  role: "learner" | "instructor"
) {
  try {
    const salt = await bcrypt.genSalt(10);

    const hash = bcrypt.hashSync(input.password, salt);

    input.password = hash;

    const user = await prisma.person.create({
      data: {
        ...input,
        role,
      },
    });

    return omit(user, "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

// For login
export const validatePassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<Omit<PersonType, "password"> | false> => {
  const user = await prisma.person.findFirst({
    where: {
      email,
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

export async function findUser(personId: string) {
  return prisma.person.findFirst({
    where: {
      id: personId,
    },
  });
}
