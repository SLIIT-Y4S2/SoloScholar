import { Content } from "antd/es/layout/layout";
import QuestionCardForFeedback from "../Feedback/QuestionCardForFeedback";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";

const CompletedTutorial = () => {
  const { questions, isFetching: isLoading } = useTutorialContext();

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
