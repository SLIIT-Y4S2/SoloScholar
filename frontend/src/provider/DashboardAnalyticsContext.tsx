import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { DASHBOARD_ANALYTICS_API_URLS } from "../utils/api_routes";
import { AxiosResponse } from "axios";
import axiosInstance from "../utils/axiosInstance";
import { CustomMessage } from "../types/dashboard.types";
import {
  getAcademicPerformanceAndLearningStrategiesLab,
  getAcademicPerformanceAndLearningStrategiesTutorial,
  getAffectiveStateTutorial,
  getLearnerPerformanceTutorial,
  getSummaryStatisticsLab,
  getSummaryStatisticsTutorial,
} from "../utils/dashboard_analytics_util";

interface DashboardAnalyticsProviderProps {
  children: ReactNode;
}

export const DashboardAnalyticsContext = createContext({} as any);

export function useDashboardAnalyticsContext() {
  const context = useContext(DashboardAnalyticsContext);
  if (!context) {
    throw new Error(
      "useDashboardAnalyticsContext must be used within a DashboardAnalyticsProvider"
    );
  }
  return context;
}

export function DashboardAnalyticsProvider({
  children,
}: Readonly<DashboardAnalyticsProviderProps>) {
  const [customMessage, setCustomMessage] = useState<CustomMessage | null>(
    null
  );

  // For tutorial component
  const [
    academicPerformanceAndLearningStrategiesTutorial,
    setAcademicPerformanceAndLearningStrategiesTutorial,
  ] = useState<{
    correctMcqPercentage: number;
    incorrectMcqPercentage: number;
    correctShortAnswerQuestionPercentage: number;
    incorrectShortAnswerQuestionPercentage: number;
    unansweredMcqPercentage: number;
    unansweredShortAnswerQuestionPercentage: number;
  } | null>(null);
  const [affectiveStateTutorial, setAffectiveStateTutorial] = useState<{
    totalFeedbackCount?: number;
    skippedFeedbackPercentage?: {
      mcq: number;
      shortAnswer: number;
    };
    basicFeedbackPercentage?: {
      mcq: number;
      shortAnswer: number;
    };
    inDetailFeedbackPercentage?: {
      mcq: number;
      shortAnswer: number;
    };
  } | null>(null);
  const [summaryStatisticsTutorial, setSummaryStatisticsTutorial] = useState<{
    totalTutorialCount: number;
    tutorialScorePercentageAvg: number;
    tutorialCompletionRateAvg: number;
  } | null>(null);
  const [learnerPerformanceTutorial, setLearnerPerformanceTutorial] = useState<{
    totalQuestionAttemptPercentage: number;
    mcqQuestionAttemptPercentage: number;
    mcqUnAttemptedPercentage: number;
    shortAnswerQuestionAttemptPercentage: number;
    shortAnswerQuestionUnattemptedPercentage: number;
    totalCorrectShortAnswerQuestionPercentage: number;
    totalIncorrectShortAnswerQuestionPercentage: number;
    totalUnansweredShortAnswerQuestionPercentage: number;
    shortAnswerHintViewedPercentage: {
      correct: number;
      incorrect: number;
      unanswered: number;
    };
  } | null>(null);

  // For lab component
  const [
    academicPerformanceAndLearningStrategiesLab,
    setAcademicPerformanceAndLearningStrategiesLab,
  ] = useState<{
    correctAnswerPercentage: number;
    incorrectAnswerPercentage: number;
    unansweredPercentage: number;
  } | null>(null);
  const [summaryStatisticsLab, setSummaryStatisticsLab] = useState<{
    totalLabsheetCount: number;
    labsheetScorePercentageAvg: number;
    labsheetCompletionRateAvg: number;
  } | null>(null);

  const getLessonsOfModule = async (moduleId: string) => {
    try {
      const response: AxiosResponse = await axiosInstance.get(
        `${DASHBOARD_ANALYTICS_API_URLS.LESSONS_OF_MODULE}/${moduleId}`
      );
      const responseData: { result?: any[]; error?: any } = await response.data;
      if (responseData.error) {
        setCustomMessage({
          type: "error",
          content: "Sorry, an unexpected server error occurred",
        });
      } else {
        const results: any[] = await response.data.result;
        return results;
      }
    } catch (error: any) {
      setCustomMessage({ type: "error", content: error.message });
    }
  };

  // For tutorial analytics
  const getTutorialAnalytics = async ({
    moduleId,
    learningLevel,
    lessonId,
    lessonTitle,
  }: {
    moduleId: number;
    learningLevel: string;
    lessonId: number;
    lessonTitle: string;
  }) => {
    try {
      const response: AxiosResponse = await axiosInstance.post(
        DASHBOARD_ANALYTICS_API_URLS.TUTORIAL_ANALYTICS,
        {
          moduleId,
          learningLevel,
          lessonId,
          lessonTitle,
        }
      );
      const responseData: { result?: any[]; error?: any } = await response.data;
      if (responseData.error) {
        setCustomMessage({
          type: "error",
          content: "Sorry, an unexpected server error occurred",
        });
      } else {
        const results: any[] = await response.data.result;
        if (results.length > 0) {
          setCustomMessage(null);
          setAcademicPerformanceAndLearningStrategiesTutorial(
            getAcademicPerformanceAndLearningStrategiesTutorial(results)
          );
          setAffectiveStateTutorial(getAffectiveStateTutorial(results));
          setSummaryStatisticsTutorial(getSummaryStatisticsTutorial(results));
          setLearnerPerformanceTutorial(getLearnerPerformanceTutorial(results));
        } else {
          setCustomMessage({ type: "info", content: "No data to display." });
        }
      }
    } catch (error: any) {
      setCustomMessage({ type: "error", content: error.message });
    }
  };

  // For lab analytics
  const getLabAnalytics = async ({
    moduleId,
    learningLevel,
    lessonId,
    lessonTitle,
  }: {
    moduleId: number;
    learningLevel: string;
    lessonId: number;
    lessonTitle: string;
  }) => {
    try {
      const response: AxiosResponse = await axiosInstance.post(
        DASHBOARD_ANALYTICS_API_URLS.LAB_ANALYTICS,
        {
          moduleId,
          learningLevel,
          lessonId,
          lessonTitle,
        }
      );
      const responseData: { result?: any[]; error?: any } = await response.data;
      if (responseData.error) {
        setCustomMessage({
          type: "error",
          content: "Sorry, an unexpected server error occurred",
        });
      } else {
        const results: any[] = await response.data.result;
        if (results.length > 0) {
          setCustomMessage(null);
          setAcademicPerformanceAndLearningStrategiesLab(
            getAcademicPerformanceAndLearningStrategiesLab(results)
          );
          // setAffectiveStateTutorial(getAffectiveStateTutorial(results));
          setSummaryStatisticsLab(getSummaryStatisticsLab(results));
          // setLearnerPerformanceTutorial(getLearnerPerformanceTutorial(results));
        } else {
          setCustomMessage({ type: "info", content: "No data to display." });
        }
      }
    } catch (error: any) {
      setCustomMessage({ type: "error", content: error.message });
    }
  };

  const contextValue = useMemo(
    () => ({
      getLessonsOfModule,
      getTutorialAnalytics,
      getLabAnalytics,
      academicPerformanceAndLearningStrategiesTutorial,
      academicPerformanceAndLearningStrategiesLab,
      affectiveStateTutorial,
      summaryStatisticsTutorial,
      summaryStatisticsLab,
      learnerPerformanceTutorial,
      customMessage,
    }),
    [
      getLessonsOfModule,
      getTutorialAnalytics,
      getLabAnalytics,
      academicPerformanceAndLearningStrategiesTutorial,
      academicPerformanceAndLearningStrategiesLab,
      affectiveStateTutorial,
      summaryStatisticsTutorial,
      summaryStatisticsLab,
      learnerPerformanceTutorial,
      customMessage,
    ]
  );

  return (
    <DashboardAnalyticsContext.Provider value={contextValue}>
      {children}
    </DashboardAnalyticsContext.Provider>
  );
}
