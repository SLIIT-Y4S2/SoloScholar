import prisma from "../../utils/prisma-client.util";

export const getIndicators = async (instructorId: string) => {
  return await prisma.analytical_indicator.findMany({
    where: {
      instructor_id: instructorId,
    },
    select: {
      id: true,
      indicator_name: true,
      analysis_goal: true,
      visualization_choice: true,
      sql_query: true,
      instructor_id: false,
    },
  });
};

export const getIndicatorData = async (indicatorId: string) => {
  const indicator = await prisma.analytical_indicator.findUnique({
    where: {
      id: indicatorId,
    },
  });
  return indicator ? prisma.$queryRawUnsafe(indicator.sql_query) : null;
};

export const dashboardDbService = {
  getIndicators,
  getIndicatorData,
};
