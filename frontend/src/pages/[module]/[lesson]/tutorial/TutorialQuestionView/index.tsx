import React from "react";
import TutorialQuestionStatus from "./TutorialQuestionStatus";
import QuestionCardForTutorialComponent from "./QuestionCardForTutorialComponent";
import { useTutorialContext } from "../../../../../provider/TutorialContext";

const TutorialQuestionView = () => {
  const { questions, current_question } = useTutorialContext();
  return (
    <div className="flex flex-col gap-4  lg:flex-row lg:items-start ">
      <TutorialQuestionStatus
        noOfQuestions={questions.length}
        answeredQuestions={questions
          .map((question, index) =>
            question.student_answer != null ? index + 1 : undefined
          )
          .filter((question) => question !== undefined)}
        current_question={current_question}
      />

      <QuestionCardForTutorialComponent />
    </div>
  );
};

export default TutorialQuestionView;
