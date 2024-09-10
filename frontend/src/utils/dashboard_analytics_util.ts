export const getAcademicPerformanceAndLearningStrategiesTutorial = (
  results: any[]
) => {
  const mcqQuestions: any[] = results.filter(
    (item) => item.tutorial_question_type === "mcq"
  );
  const shortAnswerQuestions: any[] = results.filter(
    (item) => item.tutorial_question_type === "short-answer"
  );
  const correctMCQCount = mcqQuestions.filter(
    (item) =>
      item.student_answer !== null && item.is_student_answer_correct === true
  ).length;
  const incorrectMCQCount = mcqQuestions.filter(
    (item) =>
      item.student_answer !== null && item.is_student_answer_correct === false
  ).length;
  const unansweredMCQCount = mcqQuestions.filter(
    (item) => item.student_answer === null
  ).length;
  const correctShortAnswerQuestionCount = shortAnswerQuestions.filter(
    (item) =>
      item.student_answer !== null && item.is_student_answer_correct === true
  ).length;
  const incorrectShortAnswerQuestionCount = shortAnswerQuestions.filter(
    (item) =>
      item.student_answer !== null && item.is_student_answer_correct === false
  ).length;
  const unansweredShortAnswerQuestionCount = shortAnswerQuestions.filter(
    (item) => item.student_answer === null
  ).length;

  return {
    correctMcqAvg: (correctMCQCount / mcqQuestions.length) * 100,
    incorrectMcqAvg: (incorrectMCQCount / mcqQuestions.length) * 100,
    correctShortAnswerQuestionAvg:
      (correctShortAnswerQuestionCount / shortAnswerQuestions.length) * 100,
    incorrectShortAnswerQuestionAvg:
      (incorrectShortAnswerQuestionCount / shortAnswerQuestions.length) * 100,
    unansweredMcqAvg: (unansweredMCQCount / mcqQuestions.length) * 100,
    unansweredShortAnswerQuestionAvg:
      (unansweredShortAnswerQuestionCount / shortAnswerQuestions.length) * 100,
  };
};

export const getAffectiveStateTutorial = (results: any[]) => {
  const totalFeedback = results.filter((item) => item.feedback_type !== null);
  const skippedFeedback = totalFeedback.filter(
    (item) => item.feedback_type === "skip"
  );
  const basicFeedback = totalFeedback.filter(
    (item) => item.feedback_type === "basic"
  );
  const inDetailFeedback = totalFeedback.filter(
    (item) => item.feedback_type === "detailed"
  );

  return {
    skippedFeedback: (skippedFeedback.length / totalFeedback.length) * 100,
    basicFeedback: (basicFeedback.length / totalFeedback.length) * 100,
    inDetailFeedback: (inDetailFeedback.length / totalFeedback.length) * 100,
  };
};

export const getSummaryStatisticsTutorial = (results: any[]) => {
  const totalTutorialCount = new Set(results.map((item) => item.tutorial_id));

  // Group questions by tutorial_id
  const tutorials = results.reduce((acc, item) => {
    acc[item.tutorial_id] = acc[item.tutorial_id] || [];
    acc[item.tutorial_id].push(item);
    return acc;
  }, {});

  // Calculate completion percentage for each tutorial
  const tutorialCompletionPercentages = Object.values(tutorials).map(
    (tutorialQuestions: any) => {
      const totalQuestions = tutorialQuestions.length;
      const answeredQuestions = tutorialQuestions.filter(
        (item: any) => item.student_answer !== null
      ).length;
      return (answeredQuestions / totalQuestions) * 100;
    }
  );

  // Calculate score percentage for each tutorial
  const tutorialScorePercentages = Object.values(tutorials).map(
    (tutorialQuestions: any) => {
      const totalQuestions = tutorialQuestions.length;
      const correctQuestions = tutorialQuestions.filter(
        (item: any) => item.is_student_answer_correct === true
      ).length;
      return (correctQuestions / totalQuestions) * 100;
    }
  );

  // Calculate the average completion percentage across all tutorials
  const totalPercentages = tutorialCompletionPercentages.reduce(
    (sum, percentage) => sum + percentage,
    0
  );
  const tutorialCompletionRateAvg =
    totalPercentages / tutorialCompletionPercentages.length;

  // Calculate the average tutorial score percentage across all tutorials
  const totalScores = tutorialScorePercentages.reduce(
    (sum, percentage) => sum + percentage,
    0
  );
  const tutorialScorePercentageAvg =
    totalScores / tutorialScorePercentages.length;

  return {
    totalTutorialCount: totalTutorialCount.size,
    tutorialScorePercentageAvg,
    tutorialCompletionRateAvg,
  };
};
