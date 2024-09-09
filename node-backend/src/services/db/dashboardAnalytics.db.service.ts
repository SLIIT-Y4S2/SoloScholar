import prisma from "../../utils/prisma-client.util";

const getLessonsOfModule = async (moduleId: string) => {
  return await prisma.lesson.findMany({
    where: {
      module_id: Number(moduleId),
    },
  });
};

const getTutorialAnalytics = async (requestBody: {
  moduleId: number;
  learningLevel: string;
  lessonId: number;
  lessonTitle: string;
}) => {
  const tutorialAnalytics = await prisma.$queryRawUnsafe(
    `SELECT * FROM tutorial_overview
    WHERE module_id = ${requestBody.moduleId}
    AND learning_level = '${requestBody.learningLevel}'
    AND lesson_id = ${requestBody.lessonId}
    AND lesson_title = '${requestBody.lessonTitle}'`
  );
  return tutorialAnalytics;
};

const getLectureAnalytics = async () => {
  // TODO
};

const getLabAnalytics = async () => {
  // TODO
};

export const dashboardAnalyticsDbService = {
  getTutorialAnalytics,
  getLectureAnalytics,
  getLabAnalytics,
  getLessonsOfModule,
};
