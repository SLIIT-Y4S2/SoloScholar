import { PrismaClient } from "@prisma/client";
import { dashboardUtil } from "../utils/dashboard.util";
import { RunnableSequence } from "@langchain/core/runnables";
import { logger } from "../utils/logger.utils";

async function createIndicator(goal: string): Promise<[]> {
  const sqlQuery: {
    [x: string]: string;
  } = await getSqlQuery(goal);

  return await getSqlQueryData(sqlQuery.query);
}

async function getSqlQuery(goal: string): Promise<{
  [x: string]: string;
}> {
  const sqlQueryChain: RunnableSequence<
    {
      question: string;
    },
    {
      [x: string]: string;
    }
  > = await dashboardUtil.getSqlQueryChain();

  return await sqlQueryChain.invoke({
    question: goal,
  });
}

let prismaClient: PrismaClient | null = null;

async function getSqlQueryData(query: string): Promise<[]> {
  if (prismaClient == null) {
    prismaClient = new PrismaClient();
  }

  logger.info(`Query query: ${query}`);
  return await new PrismaClient().$queryRawUnsafe(query);
}

export const dashboardService = {
  createIndicator,
};
