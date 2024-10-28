import React, { useState, useEffect } from "react";
import { useLabSessionContext } from "../../provider/lab/LabSessionContext";
import { Alert, Button, Layout, Modal, Spin } from "antd";
import { FileMarkdownOutlined, LoadingOutlined } from "@ant-design/icons";
import { CodeEditor } from "./CodeEditor";
import { useParams } from "react-router-dom";
import { SupportMaterialsForLab } from "./SupportMaterialsForLab";
import ReflectionCardForLab from "./ReflectionCardForLab";

const { Content } = Layout;

export default function QuestionCardForLab() {
  const {
    isAnsForCurrQuesCorrect,
    currentQuestionIndex,
    totalQuestions,
    questions,
    isEvaluatingAnswer,
    hintForCurrentQuestion,
    isFeedbackEnabled,
    evaluateStudentAnswerHandler,
    getHintForCurrentQuestion,
    goToNextQuestion,
    submitLabSheet,
  } = useLabSessionContext();

  const [currentAnswer, setCurrentAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showEmptyAnswerAlert, setShowEmptyAnswerAlert] = useState<boolean>(false);
  const [showEmptyReflectionAlert, setShowEmptyReflectionAlert] = useState<boolean>(false);
  const [isSupportMaterialModelOpen, setIsSupportMaterialModelOpen] = useState<boolean>(false);
  const [isSkipModalOpen, setIsSkipModalOpen] = useState<boolean>(false);
  const [reflection, setReflection] = useState<string | null>(null);
  const { labSheetId } = useParams<{ labSheetId: string }>();

  useEffect(() => {
    setCurrentAnswer(questions?.[currentQuestionIndex]?.current_answer ?? null);
  }, [currentQuestionIndex, questions]);

  const handleEvaluation = () => {
    if (currentAnswer && currentAnswer.trim() !== "") {
      evaluateStudentAnswerHandler(currentAnswer);
    } else {
      setShowEmptyAnswerAlert(true);
    }
  };

  const handleCodeOnChange = (codeSnippet: string) => {
    setCurrentAnswer(codeSnippet);
  };

  const handleNextQuestion = (event: React.FormEvent) => {
    event.preventDefault();
    setShowEmptyAnswerAlert(false);

    const currentQuestion = questions[currentQuestionIndex];

    if (
      !isFeedbackEnabled &&
      isAnsForCurrQuesCorrect &&
      !currentQuestion.is_answer_submitted
    ) {
      goToNextQuestion(null);
    } else if (
      reflection &&
      reflection.trim() !== "" &&
      isAnsForCurrQuesCorrect &&
      !currentQuestion.is_answer_submitted
    ) {
      setCurrentAnswer(null);
      setShowEmptyReflectionAlert(false);
      goToNextQuestion(reflection);
    } else {
      setShowEmptyReflectionAlert(true);
    }
  };

  const handleSkipQuestion = () => {
    setCurrentAnswer(null);
    setShowAnswer(false);
    setReflection(null);
    setShowEmptyAnswerAlert(false);
    setShowEmptyReflectionAlert(false);
    setIsSkipModalOpen(false);
    if (currentQuestionIndex === totalQuestions - 1) {
      submitLabSheet(null);
    } else {
      goToNextQuestion(null);
    }
  };

  const showSkipConfirmation = () => {
    setIsSkipModalOpen(true);
  };

  const handleSubmission = () => {
    if (isFeedbackEnabled === false) {
      submitLabSheet(reflection);
    } else if (reflection && (reflection.trim() !== "")) {
      submitLabSheet(reflection);
    } else {
      setShowEmptyReflectionAlert(true);
    }
  };

  const handleReflectionOnChange = (value: string) => {
    setReflection(value);
  };

  const currentQuestion = questions?.[currentQuestionIndex];

  return (
    <>
      <Content className="container mx-auto">
        {showEmptyAnswerAlert && (
          <Alert
            message={
              <p className="font-semibold text-bse">
                Please provide an answer before evaluating.
              </p>
            }
            type="error"
            showIcon
            closable
            onClose={() => setShowEmptyAnswerAlert(false)}
            className="mb-4"
          />
        )}
        <div className="bg-white flex flex-col mx-auto p-8 w-full h-max rounded-2xl">
          <Modal
            open={isSupportMaterialModelOpen}
            onCancel={() => setIsSupportMaterialModelOpen(false)}
            width={1000}
            footer={[]}
          >
            <SupportMaterialsForLab isNewTab={false} labSheetId={labSheetId} />
          </Modal>

          <Modal
            title="Skip Question"
            open={isSkipModalOpen}
            onCancel={() => setIsSkipModalOpen(false)}
            footer={[
              <Button key="cancel" onClick={() => setIsSkipModalOpen(false)}>
                Cancel
              </Button>,
              <Button key="skip" type="primary" onClick={handleSkipQuestion} disabled={isAnsForCurrQuesCorrect === true}>
                Skip Question
              </Button>,
            ]}
          >
            <p>
              Are you sure you want to skip this question? Your current answer will not be
              saved.
            </p>
          </Modal>

          <form onSubmit={handleNextQuestion} className="w-full">
            <div className="flex flex-row justify-between items-center flex-shrink-0">
              <h1 className="text-2xl font-bold my-2">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h1>
              <Button className="w-max" onClick={() => setIsSupportMaterialModelOpen(true)}>
                <FileMarkdownOutlined />
                Support Material
              </Button>
            </div>
            <p className="text-lg">{currentQuestion?.question}</p>
            <div className="my-4">
              <div className="flex flex-col justify-center items-center">
                <CodeEditor
                  handleCodeOnChange={handleCodeOnChange}
                  currentSnippet={currentAnswer ?? ""}
                />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-4 items-center">
                <p className="font-medium text-lg">
                  Number of attempts: {currentQuestion?.attempts}
                </p>
                <Button type="default" onClick={getHintForCurrentQuestion}>
                  Hint
                </Button>
                <Button type="default" onClick={showSkipConfirmation} disabled={isAnsForCurrQuesCorrect === true}>
                  Skip Question
                </Button>
              </div>
              {isAnsForCurrQuesCorrect === null ? (
                <></>
              ) : isAnsForCurrQuesCorrect ? (
                <p className="text-green-600 text-lg font-medium">Correct Answer</p>
              ) : (
                <p className="text-red-500 text-lg font-medium">Incorrect Answer</p>
              )}
              {isEvaluatingAnswer ? (
                <Spin
                  indicator={<LoadingOutlined spin />}
                  size="large"
                  className="border-white"
                />
              ) : isAnsForCurrQuesCorrect ? (
                <div className="flex flex-row gap-4">
                  {currentQuestionIndex === totalQuestions - 1 ? (
                    <Button type="primary" htmlType="button" onClick={handleSubmission}>
                      Submit Lab Sheet
                    </Button>
                  ) : (
                    <Button type="primary" htmlType="button" onClick={handleNextQuestion}>
                      Next Question
                    </Button>
                  )}
                </div>
              ) : (
                <Button type="primary" htmlType="button" onClick={handleEvaluation}>
                  Evaluate Answer
                </Button>
              )}
            </div>
          </form>
          <div>
            {hintForCurrentQuestion && (
              <div className="my-4">
                <p className="font-semibold my-2">Hint:</p>
                <p>{hintForCurrentQuestion}</p>
              </div>
            )}
            {showAnswer && (
              <div className="my-4">
                <p className="font-semibold my-2">Answer:</p>
                <p>{currentQuestion?.answer}</p>
              </div>
            )}
          </div>
        </div>
      </Content>
      <Content>
        {questions &&
          isFeedbackEnabled &&
          isAnsForCurrQuesCorrect &&
          !currentQuestion?.is_answer_submitted && (
            <div>
              {showEmptyReflectionAlert && (
                <Alert
                  message={
                    <p className="font-semibold text-bse">
                      Please provide a reflection before moving to the next question.
                    </p>
                  }
                  type="error"
                  showIcon
                  closable
                  onClose={() => setShowEmptyReflectionAlert(false)}
                  className="mb-4"
                />
              )}
              <ReflectionCardForLab onChange={handleReflectionOnChange} />
            </div>
          )}
      </Content>
    </>
  );
}
