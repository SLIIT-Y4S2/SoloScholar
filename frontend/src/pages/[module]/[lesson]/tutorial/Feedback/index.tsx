import QuestionCardForFeedback from "./QuestionCardForFeedback";
import { Button } from "antd";
import { useState } from "react";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";
import { Content } from "antd/es/layout/layout";

const TutorialFeedback = () => {
  const { questions, completeTutorial } = useTutorialContext();
  const [current_question_number, setQuestionNumber] = useState<
    number | undefined
  >();

  const filteredQuestions = questions.filter(
    (question) => question.feedback_type !== "skip"
  );

  //set the current question number to the first question
  if (current_question_number === undefined) {
    setQuestionNumber(filteredQuestions[0].question_number);
  }

  const current_question = filteredQuestions.find(
    (question) => question.question_number === current_question_number
  );

  if (
    !current_question ||
    !questions ||
    !filteredQuestions ||
    !current_question_number
  ) {
    return null;
  }

  const arrayOfQuestionNumbers = filteredQuestions.map(
    (question) => question.question_number
  );

  return (
    <div className="flex flex-col gap-4  lg:flex-row lg:items-start ">
      <Content className="flex flex-wrap items-center justify-center p-6 bg-white rounded-lg  gap-4 max-w-none lg:max-w-[300px]">
        {questions.map(({ question_number, feedback_type }) => (
          <Button
            key={question_number}
            className={`
        ${feedback_type === "detailed" ? "bg-blue-400 " : "bg-green-200"}
          rounded-full w-8 h-8 flex justify-center items-center font-bold cursor-pointer ${
            current_question_number === question_number
              ? "border-2 border-gray-800"
              : ""
          }`}
            onClick={() => setQuestionNumber(question_number)}
            disabled={feedback_type === "skip"}
          >
            {question_number}
          </Button>
        ))}
      </Content>
      <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
        <div>
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">Feedback</h1>
            <div className="">
              {current_question.feedback_type === "skip" ? (
                <span className="text-gray-500">Skip</span>
              ) : current_question.feedback_type === "basic" ? (
                <span className="text-green-500">Basic Explanation</span>
              ) : (
                <span className="text-blue-500">Detailed Explanation</span>
              )}
            </div>
          </div>
        </div>
        <QuestionCardForFeedback question={current_question} />
        <div className="flex justify-between flex-row-reverse">
          {current_question_number !==
            filteredQuestions[filteredQuestions.length - 1].question_number && (
            <Button
              type="primary"
              onClick={() =>
                setQuestionNumber(
                  arrayOfQuestionNumbers[
                    arrayOfQuestionNumbers.indexOf(current_question_number) + 1
                  ]
                )
              }
            >
              Next
            </Button>
          )}

          {current_question_number ===
            filteredQuestions[filteredQuestions.length - 1].question_number && (
            <Button type="primary" onClick={completeTutorial}>
              End Feedback Session
            </Button>
          )}

          {current_question_number !== filteredQuestions[0].question_number && (
            <Button
              onClick={() =>
                setQuestionNumber(
                  arrayOfQuestionNumbers[
                    arrayOfQuestionNumbers.indexOf(current_question_number) - 1
                  ]
                )
              }
            >
              Previous
            </Button>
          )}
          {/* </div> */}
        </div>
      </div>
    </div>
  );
};

export default TutorialFeedback;
