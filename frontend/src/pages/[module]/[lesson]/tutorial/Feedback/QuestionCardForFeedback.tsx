import { TutorialQuestion } from "../../../../../provider/tutorial/TutorialContext";
import CheckCircleTwoTone from "@ant-design/icons/CheckCircleTwoTone";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
import CheckCircleOutlined from "@ant-design/icons/CheckCircleOutlined";

const QuestionCardForFeedback = ({
  question: {
    question_number,
    question,
    type,
    options,
    student_answer,
    answer,
    is_student_answer_correct: isStudentAnswerCorrect,
    feedback,
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
        {student_answer == null ? (
          <span className="text-gray-500">Not answered</span>
        ) : isStudentAnswerCorrect ? (
          <span className="text-green-500">
            <CheckCircleTwoTone twoToneColor="#52c41a" /> Correct
          </span>
        ) : (
          <span className="text-red-500">
            <CloseCircleOutlined /> Incorrect
          </span>
        )}
        <div className="">
          {feedback && (
            <>
              <br />
              <strong>Feedback for your answer:</strong> <br />
              {feedback}
            </>
          )}
        </div>
        <br />
        <div className="">
          <strong>
            {type === "short-answer" ? "Example answer" : "Correct answer"}:
          </strong>
          <br />
          {answer}
        </div>
        <br />
      </p>
    </div>
  );
};

export default QuestionCardForFeedback;
