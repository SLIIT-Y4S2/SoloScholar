import React from "react";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";
import {
  TrophyOutlined,
  QuestionCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

const StatisticCard = ({ title, value, icon, color }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
    <div className={`text-3xl ${color}`}>{icon}</div>
    <div className="text-2xl font-bold mt-2">{value}</div>
    <div className="text-sm text-gray-500">{title}</div>
  </div>
);

const TutorialSummary = () => {
  const { questions, studentsAnswerForTheCurrentQuestion } =
    useTutorialContext();
  const lastQuestionAnswer = questions[questions.length - 1]?.student_answer;

  const answeredQuestions =
    questions.filter((question) => question.student_answer != null).length +
    (studentsAnswerForTheCurrentQuestion != null && lastQuestionAnswer == null
      ? 1
      : studentsAnswerForTheCurrentQuestion == null &&
        lastQuestionAnswer != null
      ? -1
      : 0);
  const totalQuestions = questions.length;
  const unansweredQuestions = totalQuestions - answeredQuestions;
  const correctAnswers = questions.filter(
    (question) => question.is_student_answer_correct
  ).length;
  const incorrectAnswers = answeredQuestions - correctAnswers;

  const score = Math.round((correctAnswers / totalQuestions) * 100);

  return (
    <div className="w-full bg-gray-100 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Tutorial Summary</h2>
      <div className="flex flex-wrap -mx-2">
        <div className="w-full sm:w-1/2 lg:w-1/3 px-2 mb-4">
          <StatisticCard
            title="Score"
            value={`${score}%`}
            icon={<TrophyOutlined />}
            color="text-yellow-500"
          />
        </div>
        <div className="w-full sm:w-1/2 lg:w-2/3 px-2">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
              <StatisticCard
                title="Total Questions"
                value={totalQuestions}
                icon={<QuestionCircleOutlined />}
                color="text-blue-500"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
              <StatisticCard
                title="Correct Answers"
                value={correctAnswers}
                icon={<CheckCircleOutlined />}
                color="text-green-500"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
              <StatisticCard
                title="Incorrect Answers"
                value={incorrectAnswers}
                icon={<CloseCircleOutlined />}
                color="text-red-500"
              />
            </div>
            <div className="w-full sm:w-1/2 lg:w-1/4 px-2 mb-4">
              <StatisticCard
                title="Unanswered"
                value={unansweredQuestions}
                icon={<ClockCircleOutlined />}
                color="text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialSummary;
