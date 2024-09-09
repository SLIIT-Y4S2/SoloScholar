import { TutorialQuestion } from "../../../../../provider/tutorial/TutorialContext";
// import { CheckCircleTwoTone, CloseCircleOutlined } from "@ant-design/icons";
import CheckCircleTwoTone from "@ant-design/icons/CheckCircleTwoTone";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";

const QuestionCardForTutorialFeedback = ({
  question: {
    question_number,
    question,
    type,
    options,
    student_answer,
    answer,
    is_student_answer_correct,
  },
}: {
  question: TutorialQuestion;
}) => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <p className="font-medium">
        {question_number}. {question}
      </p>

      {type === "short-answer" ? (
        <div className="min-h-[10em] max-h-[15em] overflow-y-auto p-2 border border-gray-300 rounded bg-white text-gray-900 whitespace-pre-wrap">
          {student_answer || ""}
        </div>
      ) : (
        options.map((option, index) => (
          <div
            key={option}
            className={`p-2 border rounded-lg flex justify-between items-center ${
              option === answer
                ? "bg-green-500"
                : option === student_answer
                ? "bg-red-200"
                : ""
            }`}
          >
            {String.fromCharCode(97 + index)}. {option}
            <div className="">
              {option === answer ? (
                <div className="flex gap-1">
                  {option === student_answer && <>Your Answer</>}
                  <CheckCircleOutlined />
                </div>
              ) : option === student_answer ? (
                <div className="flex gap-1">
                  Your Answer
                  <CloseCircleOutlined />
                </div>
              ) : null}
            </div>
          </div>
        ))
      )}
      <p>
        {!is_student_answer_correct && student_answer == null ? (
          <span className="text-gray-500">Not answered</span>
        ) : is_student_answer_correct ? (
          <span className="text-green-500">
            <CheckCircleTwoTone twoToneColor="#52c41a" /> Correct
          </span>
        ) : (
          <span className="text-red-500">
            <CloseCircleOutlined /> Incorrect
          </span>
        )}
        <br />
        <strong>{type === "mcq" ? " Answer:" : "Example Answer:"}</strong>{" "}
        <br />
        {answer}
      </p>
    </div>
  );
};

export default QuestionCardForTutorialFeedback;
