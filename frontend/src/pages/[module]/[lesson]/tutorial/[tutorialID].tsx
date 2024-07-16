import { DynamicBreadcrumbComponent } from ".";
import { Layout } from "antd";
import TutorialQuestionStatus from "./TutorialQuestionStatus";
import QuestionCardForTutorialComponent from "./QuestionCardForTutorialComponent";
import {
  TutorialProvider,
  useTutorialContext,
} from "../../../../provider/TutorialContext";

const TutorialView = () => {
  const { questions, currentQuestionNumber, isLoading } = useTutorialContext();

  if (isLoading || questions.length === 0) {
    return <>Loading...</>;
  }

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <DynamicBreadcrumbComponent />
      <div className="flex flex-col gap-4  lg:flex-row lg:items-start ">
        <TutorialQuestionStatus
          noOfQuestions={questions.length}
          answeredQuestions={questions
            .map((question, index) =>
              question.studentAnswer != null ? index + 1 : undefined
            )
            .filter((question) => question !== undefined)}
          currentQuestion={currentQuestionNumber}
        />

        <QuestionCardForTutorialComponent />
      </div>
    </Layout>
  );
};

const TutorialViewWithProvider = () => {
  return (
    <TutorialProvider>
      <TutorialView />
    </TutorialProvider>
  );
};

export default TutorialViewWithProvider;
