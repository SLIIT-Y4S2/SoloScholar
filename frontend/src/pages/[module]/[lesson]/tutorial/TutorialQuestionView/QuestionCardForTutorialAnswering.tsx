import { Content } from "antd/es/layout/layout";
import { Button, Modal } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";
import { useState } from "react";

const QuestionCardForTutorialAnswering = () => {
  const {
    submitAnswer,
    questions,
    current_question,
    studentsAnswerForTheCurrentQuestion,
    setStudentsAnswerForTheCurrentQuestion,
    isFetching: isLoading,
  } = useTutorialContext();
  const { question, options, question_number, type } =
    questions[current_question - 1];

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
      <h1>
        {question_number}. {question}
      </h1>
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
          // <Button
          //   type="primary"
          //   onClick={() => submitAnswer(question_number, null)}
          // >
          //   Submit Tutorial
          // </Button>
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
    </Content>
  );
};

export default QuestionCardForTutorialAnswering;

const SubmitTutorialButton = ({ onSubmit }: { onSubmit: () => void }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { questions, studentsAnswerForTheCurrentQuestion } =
    useTutorialContext();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    onSubmit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const lastQuestionAnswer = questions[questions.length - 1].student_answer;

  const answeredQuestions =
    questions.filter((question) => question.student_answer != null).length +
    (studentsAnswerForTheCurrentQuestion != null && lastQuestionAnswer == null
      ? 1
      : studentsAnswerForTheCurrentQuestion == null &&
        lastQuestionAnswer != null
      ? -1
      : 0);
  const totalQuestions = questions.length;
  const unansweredQuestions = totalQuestions - answeredQuestions;

  return (
    <>
      <Button type="primary" onClick={showModal}>
        Submit Tutorial
      </Button>

      <Modal
        title="Confirm Submission"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
      >
        {/* <Table
          dataSource={questions}
          columns={[
            {
              title: "Question",
              dataIndex: "question_number",
              key: "question_number",
            },
            {
              title: "Answer",
              dataIndex: "student_answer",
              key: "student_answer",
              render: (text: string | undefined) => (
                <div>{text ? "Answered" : <>Not&nbsp;Answered</>}</div>
              ),
            },
          ]}
          pagination={false}
          size="small"
          className="w-min"
        /> */}
        <div className="min-w-[300px] p-4 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Tutorial Summary</h3>
          <div className="space-y-2">
            <p className="text-sm">
              Total Questions:{" "}
              <span className="font-medium">{totalQuestions}</span>
            </p>
            <p className="text-sm">
              Answered:{" "}
              <span className="font-medium text-green-600">
                {answeredQuestions}
              </span>
            </p>
            <p className="text-sm">
              Unanswered:{" "}
              <span className="font-medium text-red-600">
                {unansweredQuestions}
              </span>
            </p>
          </div>
          <div className="mt-4 bg-white p-3 rounded border border-gray-300">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progress</span>
              <span className="text-sm font-medium">
                {Math.round((answeredQuestions / totalQuestions) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`bg-blue-600 h-2.5 rounded-full `}
                style={{
                  width: `${(answeredQuestions / totalQuestions) * 100}%`,
                }}
              ></div>
            </div>
          </div>
        </div>
        <p>Are you sure you want to submit this tutorial?</p>
        <p>Once submitted, you won't be able to make any changes.</p>
      </Modal>
    </>
  );
};
