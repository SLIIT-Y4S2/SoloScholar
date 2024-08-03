import { dashboardUtil } from "../utils/dashboard.util";
import { RunnableSequence } from "@langchain/core/runnables";
import { logger } from "../utils/logger.utils";
import prisma from "../utils/prisma-client.util";

async function generateIndicator(
  goal: string
): Promise<{ sqlQuery: string; sqlQueryData: [] }> {
  const sqlQuery: {
    [x: string]: string;
  } = await getSqlQuery(goal);

  return {
    sqlQuery: sqlQuery.query,
    sqlQueryData: await getSqlQueryData(sqlQuery.query),
  };
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

async function getSqlQueryData(query: string): Promise<[]> {
  logger.info(`Query query: ${query}`);
  return await prisma.$queryRawUnsafe(query);
}

export const dashboardService = {
  generateIndicator,
};
