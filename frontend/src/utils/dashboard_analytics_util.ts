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
