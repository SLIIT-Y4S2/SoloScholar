import QuestionCardForFeedback from "./QuestionCardForFeedback";
import { Button } from "antd";
import { useState } from "react";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";

const TutorialFeedback = () => {
  const { questions, completeTutorial } = useTutorialContext();
  const [question_number, setQuestionNumber] = useState(0);

  const filteredQuestions = questions.filter(
    (question) => question.feedback_type !== "skip"
  );

  return (
    // <div className="flex flex-col gap-4">
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg">
      <div>
        <h1 className="text-2xl font-bold">Feedback</h1>
        <div className="flex justify-between">
          <div className="">
            {question_number + 1} of {filteredQuestions.length} questions
          </div>
          <div className="">
            {filteredQuestions[question_number].feedback_type === "skip" ? (
              <span className="text-gray-500">Skip</span>
            ) : filteredQuestions[question_number].feedback_type === "basic" ? (
              <span className="text-green-500">Basic Explanation</span>
            ) : (
              <span className="text-blue-500">In-depth Explanation</span>
            )}
          </div>
        </div>
      </div>
      {/* </div> */}
      {/* <div className="flex flex-col gap-4 p-4 bg-white rounded-lg"> */}
      <QuestionCardForFeedback question={filteredQuestions[question_number]} />
      <div className="flex justify-between flex-row-reverse">
        {question_number !== filteredQuestions.length - 1 && (
          <Button
            type="primary"
            onClick={() => setQuestionNumber(question_number + 1)}
          >
            Next
          </Button>
        )}

        {question_number === filteredQuestions.length - 1 && (
          <Button type="primary" onClick={completeTutorial}>
            End Feedback Session
          </Button>
        )}

        {question_number !== 0 && (
          <Button onClick={() => setQuestionNumber(question_number - 1)}>
            Previous
          </Button>
        )}
        {/* </div> */}
      </div>
    </div>
  );
};

export default TutorialFeedback;
