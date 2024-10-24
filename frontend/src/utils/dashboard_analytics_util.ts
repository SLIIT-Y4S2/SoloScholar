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
    correctMcqPercentage: (correctMCQCount / mcqQuestions.length) * 100,
    incorrectMcqPercentage: (incorrectMCQCount / mcqQuestions.length) * 100,
    correctShortAnswerQuestionPercentage:
      (correctShortAnswerQuestionCount / shortAnswerQuestions.length) * 100,
    incorrectShortAnswerQuestionPercentage:
      (incorrectShortAnswerQuestionCount / shortAnswerQuestions.length) * 100,
    unansweredMcqPercentage: (unansweredMCQCount / mcqQuestions.length) * 100,
    unansweredShortAnswerQuestionPercentage:
      (unansweredShortAnswerQuestionCount / shortAnswerQuestions.length) * 100,
  };
};

export const getAffectiveStateTutorial = (results: any[]) => {
  const totalFeedback = results.filter((item) => item.feedback_type !== null);
  if (totalFeedback.length === 0) {
    return {
      totalFeedbackCount: 0,
    };
  }

  const totalSkippedFeedback = totalFeedback.filter(
    (item) => item.feedback_type === "skip"
  );
  const totalBasicFeedback = totalFeedback.filter(
    (item) => item.feedback_type === "basic"
  );
  const totalInDetailFeedback = totalFeedback.filter(
    (item) => item.feedback_type === "detailed"
  );
  const mcqSkippedFeedback = totalSkippedFeedback.filter(
    (item) => item.tutorial_question_type === "mcq"
  );
  const mcqBasicFeedback = totalBasicFeedback.filter(
    (item) => item.tutorial_question_type === "mcq"
  );
  const mcqInDetailFeedback = totalInDetailFeedback.filter(
    (item) => item.tutorial_question_type === "mcq"
  );
  const shortAnswerSkippedFeedback = totalSkippedFeedback.filter(
    (item) => item.tutorial_question_type === "short-answer"
  );
  const shortAnswerBasicFeedback = totalBasicFeedback.filter(
    (item) => item.tutorial_question_type === "short-answer"
  );
  const shortAnswerInDetailFeedback = totalInDetailFeedback.filter(
    (item) => item.tutorial_question_type === "short-answer"
  );

  return {
    skippedFeedbackPercentage: {
      mcq: (mcqSkippedFeedback.length / totalFeedback.length) * 100,
      shortAnswer:
        (shortAnswerSkippedFeedback.length / totalFeedback.length) * 100,
    },
    basicFeedbackPercentage: {
      mcq: (mcqBasicFeedback.length / totalFeedback.length) * 100,
      shortAnswer:
        (shortAnswerBasicFeedback.length / totalFeedback.length) * 100,
    },
    inDetailFeedbackPercentage: {
      mcq: (mcqInDetailFeedback.length / totalFeedback.length) * 100,
      shortAnswer:
        (shortAnswerInDetailFeedback.length / totalFeedback.length) * 100,
    },
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

export const getLearnerPerformanceTutorial = (results: any[]) => {
  const totalQuestions = results.length;
  const mcqQuestions: any[] = results.filter(
    (item) => item.tutorial_question_type === "mcq"
  );
  const shortAnswerQuestions: any[] = results.filter(
    (item) => item.tutorial_question_type === "short-answer"
  );

  const attemptedMCQCount: number = mcqQuestions.filter(
    (item) => item.student_answer !== null
  ).length;
  const unAttemptedMCQCount: number = mcqQuestions.length - attemptedMCQCount;

  const attemptedShortAnswerQuestionCount = shortAnswerQuestions.filter(
    (item) => item.student_answer !== null
  ).length;
  const unAttemptedShortAnswerQuestionCount: number =
    shortAnswerQuestions.length - attemptedShortAnswerQuestionCount;

  const totalQuestionsAttempted: number =
    attemptedMCQCount + attemptedShortAnswerQuestionCount;
  const totalQuestionsUnattempted: number =
    totalQuestions - totalQuestionsAttempted;

  return {
    totalQuestionAttemptPercentage:
      (totalQuestionsAttempted / totalQuestions) * 100,
    mcqQuestionAttemptPercentage:
      (attemptedMCQCount / totalQuestionsAttempted) * 100,
    mcqUnAttemptedPercentage:
      (unAttemptedMCQCount / totalQuestionsUnattempted) * 100,
    shortAnswerQuestionAttemptPercentage:
      (attemptedShortAnswerQuestionCount / totalQuestionsAttempted) * 100,
    shortAnswerQuestionUnattemptedPercentage:
      (unAttemptedShortAnswerQuestionCount / totalQuestionsUnattempted) * 100,
    totalCorrectShortAnswerQuestionPercentage:
      (shortAnswerQuestions.filter(
        (item) =>
          item.student_answer !== null &&
          item.is_student_answer_correct === true
      ).length /
        shortAnswerQuestions.length) *
      100,
    totalIncorrectShortAnswerQuestionPercentage:
      (shortAnswerQuestions.filter(
        (item) =>
          item.student_answer !== null &&
          item.is_student_answer_correct === false
      ).length /
        shortAnswerQuestions.length) *
      100,
    totalUnansweredShortAnswerQuestionPercentage:
      (unAttemptedShortAnswerQuestionCount / shortAnswerQuestions.length) * 100,
    shortAnswerHintViewedPercentage: {
      correct:
        (shortAnswerQuestions.filter(
          (item) =>
            item.student_answer !== null &&
            item.is_student_answer_correct === true &&
            item.is_hint_viewed === true
        ).length /
          shortAnswerQuestions.length) *
        100,
      incorrect:
        (shortAnswerQuestions.filter(
          (item) =>
            item.student_answer !== null &&
            item.is_student_answer_correct === false &&
            item.is_hint_viewed === true
        ).length /
          shortAnswerQuestions.length) *
        100,
      unanswered:
        (shortAnswerQuestions.filter(
          (item) => item.student_answer === null && item.is_hint_viewed === true
        ).length /
          shortAnswerQuestions.length) *
        100,
    },
  };
};
