import { Content } from "antd/es/layout/layout";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";

const TutorialQuestionStatus = ({
  noOfQuestions,
  answeredQuestions,
  current_question,
}: {
  noOfQuestions: number;
  answeredQuestions: number[];
  current_question: number;
}) => {
  const { submitAnswer } = useTutorialContext();
  return (
    <Content className="flex flex-wrap items-center justify-center p-6 bg-white rounded-lg  gap-4 max-w-none lg:max-w-[300px]">
      {Array.from({ length: noOfQuestions }, (_, index) => (
        <div
          key={index}
          className={`${
            answeredQuestions.includes(index + 1)
              ? "bg-blue-500"
              : "bg-gray-400"
          } rounded-full w-8 h-8 flex justify-center items-center text-white font-bold cursor-pointer ${
            current_question === index + 1 ? "border-2 border-gray-800" : ""
          }`}
          onClick={() => submitAnswer(current_question, index + 1)}
        >
          {index + 1}
        </div>
      ))}
    </Content>
  );
};

export default TutorialQuestionStatus;
