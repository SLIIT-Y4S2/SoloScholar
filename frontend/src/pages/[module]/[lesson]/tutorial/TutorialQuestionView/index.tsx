import TutorialQuestionStatus from "./TutorialQuestionStatus";
import QuestionCardForTutorialAnswering from "./QuestionCardForTutorialAnswering";
import { Spin } from "antd";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";

const TutorialQuestionView = () => {
  const { questions, current_question, isLoading } = useTutorialContext();

  const questionsWithAnswers = questions.filter(
    (question) => question.student_answer != null
  );

  return (
    <Spin spinning={isLoading}>
      <div className="container mx-auto flex flex-col gap-4  lg:flex-row lg:items-start ">
        <TutorialQuestionStatus
          noOfQuestions={questions.length}
          answeredQuestions={questionsWithAnswers.map(
            (question) => questions.indexOf(question) + 1
          )}
          current_question={current_question}
        />

        <QuestionCardForTutorialAnswering />
      </div>
    </Spin>
  );
};

export default TutorialQuestionView;
