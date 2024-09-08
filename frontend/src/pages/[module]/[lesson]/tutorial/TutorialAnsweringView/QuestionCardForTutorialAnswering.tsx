import { Content } from "antd/es/layout/layout";
import { Button, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";
import { useState } from "react";
import BulbOutlined from "@ant-design/icons/BulbOutlined";
import SubmitTutorialButton from "./SubmitTutorialButton";

const QuestionCardForTutorialAnswering = () => {
  const {
    submitAnswer,
    questions,
    current_question,
    studentsAnswerForTheCurrentQuestion,
    setStudentsAnswerForTheCurrentQuestion,
    isFetching: isLoading,
  } = useTutorialContext();
  const { question, options, question_number, type, hint } =
    questions[current_question - 1];

  const [isHintModalVisible, setIsHintModalVisible] = useState(false);

  if (isLoading || questions.length === 0) {
    return <>Loading...</>;
  }

  return (
    <Content
      style={{
        padding: 24,
        margin: 0,
        minHeight: 280,
        background: "#ffff",
        borderRadius: "15px",
      }}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-1">
        <p className="mb-2">
          {question_number}. {question}
        </p>
        {hint && (
          <Button
            type="default"
            icon={<BulbOutlined />}
            onClick={() => setIsHintModalVisible(true)}
            className="hover:bg-yellow-100 transition-colors duration-300"
          >
            Hint
          </Button>
        )}
      </div>

      {type === "short-answer" ? (
        <TextArea
          value={studentsAnswerForTheCurrentQuestion || ""}
          onChange={(e) =>
            setStudentsAnswerForTheCurrentQuestion(e.target.value || null)
          }
          autoSize={{
            minRows: 10,
            maxRows: 15,
          }}
        />
      ) : (
        options.map((option, index) => (
          <div
            key={option}
            onClick={() => setStudentsAnswerForTheCurrentQuestion(option)}
            className={`p-2 border rounded-lg cursor-pointer ${
              studentsAnswerForTheCurrentQuestion === option
                ? "bg-blue-200"
                : ""
            }`}
          >
            {String.fromCharCode(97 + index)}. {option}
          </div>
        ))
      )}
      <div className="flex justify-between flex-row-reverse">
        {current_question !== questions.length && (
          <Button
            type="primary"
            onClick={() => submitAnswer(question_number, question_number + 1)}
          >
            Next
          </Button>
        )}

        {current_question === questions.length && (
          <SubmitTutorialButton
            onSubmit={() => submitAnswer(question_number, null)}
          />
        )}

        {current_question !== 1 && (
          <Button
            onClick={() => submitAnswer(question_number, question_number - 1)}
          >
            Previous
          </Button>
        )}
      </div>

      {hint && (
        <Modal
          title="Hint"
          open={isHintModalVisible}
          onCancel={() => setIsHintModalVisible(false)}
          footer={[
            <Button key="close" onClick={() => setIsHintModalVisible(false)}>
              Close
            </Button>,
          ]}
        >
          <p>{hint}</p>
        </Modal>
      )}
    </Content>
  );
};

export default QuestionCardForTutorialAnswering;
