// import prisma from "./prisma";
import resetDb from "./reset-db";
jest.setTimeout(30000);

beforeAll(async () => {
  await resetDb();
});

afterAll(async () => {});
