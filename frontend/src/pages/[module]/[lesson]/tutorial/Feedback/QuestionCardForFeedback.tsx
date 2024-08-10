import { TutorialQuestion } from "../../../../../provider/TutorialContext";
// import { CheckCircleTwoTone, CloseCircleOutlined } from "@ant-design/icons";
import CheckCircleTwoTone from "@ant-design/icons/CheckCircleTwoTone";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
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
      <h1>
        {question_number}. {question}
      </h1>

      {type === "essay" ? (
        <div className="min-h-[10em] max-h-[15em] overflow-y-auto p-2 border border-gray-300 rounded bg-white text-gray-900 whitespace-pre-wrap">
          {student_answer || ""}
        </div>
      ) : (
        options.map((option, index) => (
          <div
            key={option}
            className={`p-2 border rounded-lg ${
              option === answer
                ? "bg-green-500"
                : option === student_answer
                ? "bg-red-200"
                : ""
            }`}
          >
            {String.fromCharCode(97 + index)}. {option}
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
        {feedback && (
          <>
            <br />
            <strong>Feedback for your answer:</strong> <br />
            {feedback}
          </>
        )}
        <br />
        <strong>Example answer:</strong> <br />
        {answer}
      </p>
    </div>
  );
};

export default QuestionCardForFeedback;
