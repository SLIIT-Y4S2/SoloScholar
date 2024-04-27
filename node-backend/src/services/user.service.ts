import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/user.model";

export async function createUser(input: UserInput) {
  try {
    // M
    const user = await UserModel.create(input);
    // Sql

    return omit(user.toJSON(), "password");
  } catch (e: any) {
    throw new Error(e);
  }
}

// For login
export const validatePassword = async ({
  studentId,
  password,
}: {
  studentId: string;
  password: string;
}): Promise<Omit<UserDocument, "password"> | false> => {
  const user = await UserModel.findOne({ studentId });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
};

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
