import { Prisma } from "@prisma/client";

export type PersonType = Prisma.personGetPayload<{}>;

export type PersonCreateInput = Omit<Prisma.personCreateInput, "role">;

export type SessionType = Prisma.sessionGetPayload<{}>;
