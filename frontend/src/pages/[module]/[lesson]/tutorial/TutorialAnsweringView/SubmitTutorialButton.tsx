import { useState } from "react";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";
import { Button, Modal } from "antd";

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

export default SubmitTutorialButton;
