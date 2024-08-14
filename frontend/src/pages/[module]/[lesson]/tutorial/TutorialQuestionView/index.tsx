import TutorialQuestionStatus from "./TutorialQuestionStatus";
import QuestionCardForTutorialAnswering from "./QuestionCardForTutorialAnswering";
import { useTutorialContext } from "../../../../../provider/TutorialContext";

const TutorialQuestionView = () => {
  const { questions, current_question } = useTutorialContext();

  const questionsWithAnswers = questions.filter(
    (question) => question.student_answer != null
  );

  return (
    <div className="flex flex-col gap-4  lg:flex-row lg:items-start ">
      <TutorialQuestionStatus
        noOfQuestions={questions.length}
        answeredQuestions={questionsWithAnswers.map(
          (question) => questions.indexOf(question) + 1
        )}
        current_question={current_question}
      />

      <QuestionCardForTutorialAnswering />
    </div>
  );
};

export default TutorialQuestionView;
