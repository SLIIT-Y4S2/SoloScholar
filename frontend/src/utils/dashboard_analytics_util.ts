/**
 * For tutorial component
 */
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
    correctMcqPercentage: Math.round(
      (correctMCQCount / mcqQuestions.length) * 100
    ),
    incorrectMcqPercentage: Math.round(
      (incorrectMCQCount / mcqQuestions.length) * 100
    ),
    correctShortAnswerQuestionPercentage: Math.round(
      (correctShortAnswerQuestionCount / shortAnswerQuestions.length) * 100
    ),
    incorrectShortAnswerQuestionPercentage: Math.round(
      (incorrectShortAnswerQuestionCount / shortAnswerQuestions.length) * 100
    ),
    unansweredMcqPercentage: Math.round(
      (unansweredMCQCount / mcqQuestions.length) * 100
    ),
    unansweredShortAnswerQuestionPercentage: Math.round(
      (unansweredShortAnswerQuestionCount / shortAnswerQuestions.length) * 100
    ),
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
      mcq: Math.round((mcqSkippedFeedback.length / totalFeedback.length) * 100),
      shortAnswer: Math.round(
        (shortAnswerSkippedFeedback.length / totalFeedback.length) * 100
      ),
    },
    basicFeedbackPercentage: {
      mcq: Math.round((mcqBasicFeedback.length / totalFeedback.length) * 100),
      shortAnswer: Math.round(
        (shortAnswerBasicFeedback.length / totalFeedback.length) * 100
      ),
    },
    inDetailFeedbackPercentage: {
      mcq: Math.round(
        (mcqInDetailFeedback.length / totalFeedback.length) * 100
      ),
      shortAnswer: Math.round(
        (shortAnswerInDetailFeedback.length / totalFeedback.length) * 100
      ),
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
  const attemptedShortAnswerQuestionCount = shortAnswerQuestions.filter(
    (item) => item.student_answer !== null
  ).length;
  const unAttemptedShortAnswerQuestionCount: number =
    shortAnswerQuestions.length - attemptedShortAnswerQuestionCount;

  const totalQuestionsAttempted: number =
    attemptedMCQCount + attemptedShortAnswerQuestionCount;

  return {
    totalQuestionAttemptPercentage: Math.round(
      (totalQuestionsAttempted / totalQuestions) * 100
    ),
    mcqQuestionAttemptPercentage: Math.round(
      (attemptedMCQCount / totalQuestionsAttempted) * 100
    ),
    shortAnswerQuestionAttemptPercentage: Math.round(
      (attemptedShortAnswerQuestionCount / totalQuestionsAttempted) * 100
    ),
    totalCorrectShortAnswerQuestionPercentage: Math.round(
      (shortAnswerQuestions.filter(
        (item) =>
          item.student_answer !== null &&
          item.is_student_answer_correct === true
      ).length /
        shortAnswerQuestions.length) *
        100
    ),
    totalIncorrectShortAnswerQuestionPercentage: Math.round(
      (shortAnswerQuestions.filter(
        (item) =>
          item.student_answer !== null &&
          item.is_student_answer_correct === false
      ).length /
        shortAnswerQuestions.length) *
        100
    ),
    totalUnansweredShortAnswerQuestionPercentage: Math.round(
      (unAttemptedShortAnswerQuestionCount / shortAnswerQuestions.length) * 100
    ),
    shortAnswerHintViewedPercentage: {
      correct: Math.round(
        (shortAnswerQuestions.filter(
          (item) =>
            item.student_answer !== null &&
            item.is_student_answer_correct === true &&
            item.is_hint_viewed === true
        ).length /
          shortAnswerQuestions.length) *
          100
      ),
      incorrect: Math.round(
        (shortAnswerQuestions.filter(
          (item) =>
            item.student_answer !== null &&
            item.is_student_answer_correct === false &&
            item.is_hint_viewed === true
        ).length /
          shortAnswerQuestions.length) *
          100
      ),
      unanswered: Math.round(
        (shortAnswerQuestions.filter(
          (item) => item.student_answer === null && item.is_hint_viewed === true
        ).length /
          shortAnswerQuestions.length) *
          100
      ),
    },
  };
};

/**
 * For lab component
 */
export const getAcademicPerformanceAndLearningStrategiesLab = (
  results: any[]
) => {
  const totalQuestionCount = results.length;
  const totalCorrectAnswerCount = results.filter(
    (item) => item.is_student_answer_submitted && item.is_student_answer_correct
  ).length;
  const totalIncorrectAnswerCount = results.filter(
    (item) =>
      item.is_student_answer_submitted && !item.is_student_answer_correct
  ).length;
  const totalUnansweredCount = results.filter(
    (item) => !item.is_student_answer_submitted
  ).length;

  return {
    correctAnswerPercentage: Math.round(
      (totalCorrectAnswerCount / totalQuestionCount) * 100
    ),
    incorrectAnswerPercentage: Math.round(
      (totalIncorrectAnswerCount / totalQuestionCount) * 100
    ),
    unansweredPercentage: Math.round(
      (totalUnansweredCount / totalQuestionCount) * 100
    ),
  };
};

export const getSummaryStatisticsLab = (results: any[]) => {
  const totalLabsheetCount = new Set(results.map((item) => item.labsheet_id))
    .size;
  const labsheets = results.reduce((acc, item) => {
    acc[item.labsheet_id] = acc[item.labsheet_id] || [];
    acc[item.labsheet_id].push(item);
    return acc;
  }, {});

  const labsheetCompletionPercentages = Object.values(labsheets).map(
    (labsheetQuestions: any) => {
      const totalQuestions = labsheetQuestions.length;
      const answeredQuestions = labsheetQuestions.filter(
        (item: any) => item.is_student_answer_submitted
      ).length;
      return (answeredQuestions / totalQuestions) * 100;
    }
  );

  const labsheetScorePercentages = Object.values(labsheets).map(
    (labsheet: any) => labsheet[0].labsheet_score
  );

  const totalPercentages = labsheetCompletionPercentages.reduce(
    (sum, percentage) => sum + percentage,
    0
  );

  const totalScores = labsheetScorePercentages.reduce(
    (sum: number, percentage: number) => sum + percentage,
    0
  );

  return {
    totalLabsheetCount: totalLabsheetCount,
    labsheetScorePercentageAvg: totalScores / labsheetScorePercentages.length,
    labsheetCompletionRateAvg:
      totalPercentages / labsheetCompletionPercentages.length,
  };
};

export const getAffectiveStateLab = (results: any[]) => {
  // Group results by labsheet_id
  const labsheets = results.reduce((acc, item) => {
    acc[item.labsheet_id] = acc[item.labsheet_id] || [];
    acc[item.labsheet_id].push(item);
    return acc;
  }, {});

  // Find the number of labsheets where is_feedback_enabled is true
  const totalFeedbackEnabledLabCount = Object.values(labsheets).filter(
    (labsheet: any) => labsheet.some((item: any) => item.is_feedback_enabled)
  ).length;

  const totalCorrectAnswers = results.filter(
    (item) => item.is_student_answer_submitted && item.is_student_answer_correct
  );

  if (totalCorrectAnswers.length === 0) {
    return {
      totalCorrectAnswerCount: 0,
      correctAnswerReflectionPercentage: 0,
      totalFeedbackEnabledLabsheetPercentage: Math.round(
        (totalFeedbackEnabledLabCount / Object.keys(labsheets).length) * 100
      ),
    };
  }

  const totalCorrectAnswerReflectionCount = totalCorrectAnswers.filter(
    (item) => item.student_reflection
  ).length;

  return {
    totalCorrectAnswerCount: totalCorrectAnswers.length,
    correctAnswerReflectionPercentage: Math.round(
      (totalCorrectAnswerReflectionCount / totalCorrectAnswers.length) * 100
    ),
    totalFeedbackEnabledLabsheetPercentage: Math.round(
      (totalFeedbackEnabledLabCount / Object.keys(labsheets).length) * 100
    ),
  };
};

export const getLearnerPerformanceLab = (results: any[]) => {
  // Group by labsheet_question_id
  const labsheetQuestions = results.reduce((acc, item) => {
    acc[item.labsheet_question_id] = acc[item.labsheet_question_id] || [];
    acc[item.labsheet_question_id].push(item);
    return acc;
  }, {});

  // Format the data where average hint views on the Y-axis and the number of attempts on the X-axis
  const data: {
    questionAttemptCount: number;
    averageHintViews: number;
  }[] = Object.values(labsheetQuestions).map((questionAttempts: any) => {
    return {
      questionAttemptCount: questionAttempts.length,
      averageHintViews: Math.round(
        questionAttempts.reduce(
          (sum: number, questionAttempt: any) =>
            sum + questionAttempt.hint_views,
          0
        ) / questionAttempts.length
      ),
    };
  });

  return data;
};

/**
 * For lecture component
 */
export const getSummaryStatisticsLecture = (results: any[]) => {
  const totalLectureCount = new Set(results.map((item) => item.lecture_id))
    .size;

  // Group results by sub_lecture_id
  const subLectures = results.reduce((acc, item) => {
    acc[item.sub_lecture_id] = acc[item.sub_lecture_id] || [];
    acc[item.sub_lecture_id].push(item);
    return acc;
  }, {});

  const subVideosCompletedWatching = Object.values(subLectures).filter(
    (subLecture: any) => subLecture[0].is_sub_lecture_completed
  ).length;

  // Lecture completion rate = preassessment score + postassessment score + video completion rate
  // Group results by lecture_id
  const lectures = results.reduce((acc, item) => {
    acc[item.lecture_id] = acc[item.lecture_id] || [];
    acc[item.lecture_id].push(item);
    return acc;
  }, {});

  const completionPercentages = Object.values(lectures).map((lecture: any) => {
    // Total unique preassessment questions
    const preAssessmentQuestionsCount = new Set(
      lecture
        .filter((item: any) => item.lecture_assessment_question_type === "pre")
        .map((item: any) => item.lecture_assessment_question_id)
    ).size;

    // Total unique postassessment questions
    const postAssessmentQuestionsCount = new Set(
      lecture
        .filter((item: any) => item.lecture_assessment_question_type === "post")
        .map((item: any) => item.lecture_assessment_question_id)
    ).size;

    const preAssessmentCompletionPercentage =
      (new Set(
        lecture
          .filter(
            (item: any) =>
              item.lecture_assessment_question_type === "pre" &&
              item.student_answer !== null
          )
          .map((item: any) => item.lecture_assessment_question_id)
      ).size /
        preAssessmentQuestionsCount) *
      100;

    const postAssessmentCompletionPercentage =
      (new Set(
        lecture
          .filter(
            (item: any) =>
              item.lecture_assessment_question_type === "post" &&
              item.student_answer !== null
          )
          .map((item: any) => item.lecture_assessment_question_id)
      ).size /
        postAssessmentQuestionsCount) *
      100;

    // Group results by sub_lecture_id
    const subLectures = lecture.reduce((acc: any, item: any) => {
      acc[item.sub_lecture_id] = acc[item.sub_lecture_id] || [];
      acc[item.sub_lecture_id].push(item);
      return acc;
    }, {});

    // Total unique sublectures
    const subLecturesCount = new Set(
      lecture.map((item: any) => item.sub_lecture_id)
    ).size;

    const subLecturesCompletedWatchingCount = Object.values(subLectures).filter(
      (subLecture: any) => subLecture[0].is_sub_lecture_completed
    ).length;

    const videCompletionPercentage =
      (subLecturesCompletedWatchingCount / subLecturesCount) * 100;

    return {
      preAssessmentCompletionPercentage,
      postAssessmentCompletionPercentage,
      videCompletionPercentage,
    };
  });

  // Calculate the average completion rate across all lectures
  // (Theory: Each lecture has a pre-assessment, post-assessment, and video and each has equal weightage)
  let lectureCompletionRateAvg = 0;
  for (const item of completionPercentages) {
    lectureCompletionRateAvg +=
      (item.preAssessmentCompletionPercentage +
        item.postAssessmentCompletionPercentage +
        item.videCompletionPercentage) /
      Object.keys(item).length;
  }
  lectureCompletionRateAvg /= completionPercentages.length;

  return {
    totalLectureCount: totalLectureCount,
    subLectureVideosCompletedAvg:
      subVideosCompletedWatching / totalLectureCount,
    lectureCompletionRateAvg,
  };
};

export const getEngagementAndPerformanceLecture = (results: any[]) => {
  // Group results by lecture_id
  const lectures = results.reduce((acc, item) => {
    acc[item.lecture_id] = acc[item.lecture_id] || [];
    acc[item.lecture_id].push(item);
    return acc;
  }, {});

  let totalPreAssessmentQuestions: any[] = [];
  let totalPostAssessmentQuestions: any[] = [];
  for (const lecture of Object.values(lectures) as any[]) {
    const uniquePreAssessmentQuestions = new Map();
    lecture
      .filter((item: any) => item.lecture_assessment_question_type === "pre")
      .forEach((item: any) => {
        uniquePreAssessmentQuestions.set(
          item.lecture_assessment_question_id,
          item
        );
      });
    totalPreAssessmentQuestions.push(...uniquePreAssessmentQuestions.values());

    const uniquePostAssessmentQuestions = new Map();
    lecture
      .filter((item: any) => item.lecture_assessment_question_type === "post")
      .forEach((item: any) => {
        uniquePostAssessmentQuestions.set(
          item.lecture_assessment_question_id,
          item
        );
      });
    totalPostAssessmentQuestions.push(
      ...uniquePostAssessmentQuestions.values()
    );
  }

  // Calculate the average score percentage for pre-assessment and post-assessment questions
  const preAssessmentScorePercentageAvg =
    (totalPreAssessmentQuestions.reduce((acc, item) => {
      acc += item.correct_answer === item.student_answer ? 1 : 0;
      return acc;
    }, 0) /
      totalPreAssessmentQuestions.length) *
    100;

  const postAssessmentScorePercentageAvg =
    (totalPostAssessmentQuestions.reduce((acc, item) => {
      acc += item.correct_answer === item.student_answer ? 1 : 0;
      return acc;
    }, 0) /
      totalPostAssessmentQuestions.length) *
    100;

  // Group totalPreAssessmentQuestions and totalPostAssessmentQuestions again by lecture_id
  const preAssessmentQuestionsByLecture = totalPreAssessmentQuestions.reduce(
    (acc, item) => {
      acc[item.lecture_id] = acc[item.lecture_id] || [];
      acc[item.lecture_id].push(item);
      return acc;
    },
    {}
  );

  const postAssessmentQuestionsByLecture = totalPostAssessmentQuestions.reduce(
    (acc, item) => {
      acc[item.lecture_id] = acc[item.lecture_id] || [];
      acc[item.lecture_id].push(item);
      return acc;
    },
    {}
  );

  // Calculate the participation rates
  // Theory: If the student_answer column is not null, then the student has participated in the question
  let preAssessmentParticipationRate: number = 0;
  for (const item of Object.values(preAssessmentQuestionsByLecture) as any[]) {
    const totalQuestions = item.length;
    const answeredQuestions = item.filter(
      (item: any) => item.student_answer !== null
    ).length;
    preAssessmentParticipationRate +=
      (answeredQuestions / totalQuestions) * 100;
  }
  preAssessmentParticipationRate /= Object.keys(
    preAssessmentQuestionsByLecture
  ).length;

  let postAssessmentParticipationRate: number = 0;
  for (const item of Object.values(postAssessmentQuestionsByLecture) as any[]) {
    const totalQuestions = item.length;
    const answeredQuestions = item.filter(
      (item: any) => item.student_answer !== null
    ).length;
    postAssessmentParticipationRate +=
      (answeredQuestions / totalQuestions) * 100;
  }
  postAssessmentParticipationRate /= Object.keys(
    postAssessmentQuestionsByLecture
  ).length;

  return {
    preAssessmentParticipationRate: Math.round(preAssessmentParticipationRate),
    preAssessmentScorePercentageAvg: Math.round(
      preAssessmentScorePercentageAvg
    ),
    postAssessmentParticipationRate: Math.round(
      postAssessmentParticipationRate
    ),
    postAssessmentScorePercentageAvg: Math.round(
      postAssessmentScorePercentageAvg
    ),
  };
};
