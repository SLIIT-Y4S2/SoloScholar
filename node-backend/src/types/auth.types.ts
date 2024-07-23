import { Prisma } from "@prisma/client";

export type LearnerType = Prisma.learnerGetPayload<{}>;

export type SessionType = Prisma.sessionGetPayload<{}>;
