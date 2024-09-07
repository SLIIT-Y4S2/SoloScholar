import prisma from "../../utils/prisma-client.util";

export const saveIndicator = async (indicator: any) => {
  return await prisma.analytical_indicator.create({
    data: {
      indicator_name: indicator.indicatorName,
      analysis_goal: indicator.analysisGoal,
      visualization_choice: indicator.visualizationChoice,
      sql_query: indicator.sqlQuery,
      instructor_id: indicator.instructorId,
    },
  });
};

export const getIndicators = async (instructorId: string) => {
  const indicators = await prisma.analytical_indicator.findMany({
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
  return indicators.length > 0 ? indicators : null;
};

export const getIndicatorData = async (indicatorId: string) => {
  const indicator = await prisma.analytical_indicator.findUnique({
    where: {
      id: indicatorId,
    },
  });
  return indicator ? await prisma.$queryRawUnsafe(indicator.sql_query) : null;
};

export const editIndicator = async (indicator: any) => {
  return await prisma.analytical_indicator.update({
    where: {
      id: indicator.id,
      instructor_id: indicator.instructorId,
    },
    data: {
      indicator_name: indicator.indicatorName,
      visualization_choice: indicator.visualizationChoice,
    },
  });
};

export const deleteIndicator = async (
  indicatorId: string,
  instructorId: string
) => {
  return await prisma.analytical_indicator.delete({
    where: {
      id: indicatorId,
      instructor_id: instructorId,
    },
  });
};

export const dashboardDbService = {
  saveIndicator,
  getIndicators,
  getIndicatorData,
  editIndicator,
  deleteIndicator,
};
