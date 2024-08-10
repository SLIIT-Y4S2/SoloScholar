import { Content } from "antd/es/layout/layout";
import { useTutorialContext } from "../../../../../provider/TutorialContext";
import QuestionCardForFeedback from "../Feedback/QuestionCardForFeedback";

const CompletedTutorial = () => {
  const { questions, isLoading } = useTutorialContext();

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <Content className="flex flex-col gap-4 p-4 bg-white rounded-lg">
      <h1 className="text-2xl font-bold">Tutorial </h1>

      {questions.map((question) => (
        <div
          key={question.id}
          className="flex justify-between items-start gap-4 p-4 border rounded-lg bg-white shadow-md md:flex-row md:items-center flex-col"
        >
          <QuestionCardForFeedback question={question} />
        </div>
      ))}
    </Content>
  );
};

export default CompletedTutorial;
