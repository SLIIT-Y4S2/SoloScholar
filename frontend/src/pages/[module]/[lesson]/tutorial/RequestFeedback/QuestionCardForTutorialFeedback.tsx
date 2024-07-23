import TextArea from "antd/es/input/TextArea";
import React from "react";
import { TutorialQuestion } from "../../../../../provider/TutorialContext";
// import { CheckCircleTwoTone, CloseCircleOutlined } from "@ant-design/icons";
import CheckCircleTwoTone from "@ant-design/icons/CheckCircleTwoTone";
import CloseCircleOutlined from "@ant-design/icons/CloseCircleOutlined";
const QuestionCardForTutorialFeedback = ({
  question: {
    question_number,
    question,
    type,
    options,
    student_answer,
    answer,
    isStudentAnswerCorrect,
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
        <TextArea value={student_answer || ""} disabled />
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
        <br />
        <strong>Answer:</strong> <br />
        {answer}
      </p>
    </div>
  );
};

export default QuestionCardForTutorialFeedback;
