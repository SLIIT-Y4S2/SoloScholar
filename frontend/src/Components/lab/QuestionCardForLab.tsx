import { useState } from "react";
import { useLabSessionContext } from "../../provider/lab/LabSessionContext";
import { Button, Input, Layout, Modal, Spin } from "antd";
import { ExportOutlined, FileMarkdownOutlined, LoadingOutlined } from "@ant-design/icons";
import { CodeEditor } from "./CodeEditor";
import { Link, useParams } from "react-router-dom";
import { SupportMaterialsForLab } from "./SupportMaterialsForLab";
const { Content } = Layout;
const { TextArea } = Input;

export default function QuestionCardForLab() {
  const {
    isAnsForCurrQuesCorrect,
    currentQuestionIndex,
    totalQuestions,
    questions,
    evaluateStudentAnswerHandler,
    isLoading,
    isEvaluatingAnswer,
    hintForCurrentQuestion,
    getHintForCurrentQuestion,
    goToNextQuestion,
    isLabCompleted,
  } = useLabSessionContext();

  const [currentAnswer, setCurrentAnswer] = useState<string>("");
  // const [showHint, setShowHint] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const { labSheetId } = useParams();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (currentAnswer && currentAnswer.trim() !== "") {
      evaluateStudentAnswerHandler(currentAnswer);
    } else {
      alert("Please provide an answer");
    }
  }

  function handleCodeOnChange(codeSnippet: string) {
    setCurrentAnswer(codeSnippet);
    console.log(codeSnippet);

  }

  function handleNextQuestion(event: React.FormEvent) {
    event.preventDefault();
    setCurrentAnswer("");
    goToNextQuestion();
  }

  if (isLoading) {
    return (
      <Content>
        <div className="flex items-center justify-center h-screen">
          <Spin
            indicator={<LoadingOutlined spin />}
            size="large"
            className="border-white"
          />
        </div>
      </Content>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <Content>
        <div className="flex items-center justify-center h-screen">
          <p>No questions available</p>
        </div>
      </Content>
    );
  }


  return (
    <Content>
      <div className="bg-white flex flex-col mx-auto p-8 w-full max-w-[1200px] max-h-[800] h-max rounded-2xl">
        <Modal open={open} onCancel={() => setOpen(false)} width={1000} footer={[]}>
          <Link to={`../${labSheetId}/support-material`} relative={"path"} target="_blank">
            <div className="text-base font-bold py-2 px-4 border-2 border-solid border-blue-600 w-max text-blue-600 rounded-xl">
              <ExportOutlined />
            </div>
          </Link>
          <SupportMaterialsForLab />
        </Modal>
        {!isLabCompleted ? (
          <form className="" onSubmit={handleNextQuestion}>
            <h1 className="text-2xl font-bold my-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h1>
            <p>{questions && questions[currentQuestionIndex].question}</p>
            <div className="my-4">
              <div className="flex flex-row justify-between">
                <p className="font-semibold">
                  Provide your answer in below code editor.
                </p>
                <Button className="w-max" onClick={() => setOpen(true)}><FileMarkdownOutlined />Support Material</Button>
              </div>
              <div className="flex flex-col justify-center items-center">
                <CodeEditor handleCodeOnChange={handleCodeOnChange} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-4 items-center justify-between">
                <p className="font-medium">
                  Number of attempts : {questions && questions[currentQuestionIndex].attempts}
                </p>
                {questions && questions[currentQuestionIndex]?.attempts >= 3 &&
                  questions[currentQuestionIndex]?.attempts < 6 && (
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={() => getHintForCurrentQuestion()}
                    >
                      Hint
                    </Button>
                  )}
                {questions && questions[currentQuestionIndex].attempts >= 6 && (
                  <Button type="text" className="text-red-500">Show Answer</Button>
                )}
              </div>
              {isAnsForCurrQuesCorrect && isAnsForCurrQuesCorrect ? (
                <p className="text-green-500">Correct Answer</p>
              ) : isAnsForCurrQuesCorrect == false ? (
                <p className="text-red-500">Incorrect Answer</p>
              ) : null}
              {isEvaluatingAnswer ? (
                <Spin
                  indicator={<LoadingOutlined spin />}
                  size="large"
                  className="border-white"
                />
              ) : questions && questions[currentQuestionIndex].attempts >= 6 ||
                isAnsForCurrQuesCorrect ? (
                isLabCompleted ? (
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={handleNextQuestion}
                  >
                    Submit Lab
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    htmlType="button"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </Button>
                )
              ) : (
                <Button type="primary" htmlType="button" onClick={handleSubmit}>
                  Evaluate Answer
                </Button>
              )}
            </div>
            <div>
              {hintForCurrentQuestion && (
                <div className="my-4">
                  <p className="font-semibold my-2">Hint:</p>
                  <p>{hintForCurrentQuestion}</p>
                </div>
              )}
            </div>
          </form>
        ) : (
          <div>
            <div className="my-4">
              <p className="font-semibold my-2">
                Write a small reflection on the lab you just completed.
              </p>
              <TextArea
                className="overflow-visible bg-sky-950 text-white w-full p-4 custom-scrollbar hover:bg-sky-950 focus:bg-sky-950"
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </div>
            <Button type="primary" htmlType="button" onClick={() => { }}>
              Finish Exercise
            </Button>
          </div>
        )}
      </div>
    </Content>
  );
}
