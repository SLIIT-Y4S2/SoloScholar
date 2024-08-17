import { useState } from "react";
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
    evaluateStudentAnswerHandler,
    isEvaluatingAnswer,
    hintForCurrentQuestion,
    getHintForCurrentQuestion,
    goToNextQuestion,
    submitLabSheet
  } = useLabSessionContext();

  const [currentAnswer, setCurrentAnswer] = useState<string>(() => {
    return questions?.[currentQuestionIndex]?.current_answer ?? "";
  });
  // const [showHint, setShowHint] = useState<boolean>(false);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showEmptyAnswerAlert, setShowEmptyAnswerAlert] = useState<boolean>(false);
  const [showEmptyReflectionAlert, setShowEmptyReflectionAlert] = useState<boolean>(false);
  const [isSupportMaterialModelOpen, setIsSupportMaterialModelOpen] = useState<boolean>(false);
  const [reflection, setReflection] = useState<string>("");
  const { labSheetId } = useParams();

  function handleEvaluation() {
    if (currentAnswer && currentAnswer.trim() !== "") {
      evaluateStudentAnswerHandler(currentAnswer);
    } else {
      setShowEmptyAnswerAlert(true);
    }
  }

  function handleCodeOnChange(codeSnippet: string) {
    setCurrentAnswer(codeSnippet);
    console.log(codeSnippet);

  }

  function handleNextQuestion(event: React.FormEvent) {
    event.preventDefault();

    setShowEmptyAnswerAlert(false);

    if (!questions[currentQuestionIndex].is_correct && !questions[currentQuestionIndex].is_answer_submitted && questions?.[currentQuestionIndex]?.attempts >= 6) {
      console.log("triggered");
      setCurrentAnswer("");
      setShowAnswer(false);
      goToNextQuestion("");
    }

    if (reflection && reflection.trim() !== "" && questions[currentQuestionIndex].is_correct && !questions[currentQuestionIndex].is_answer_submitted) {
      setCurrentAnswer("");
      goToNextQuestion(reflection);
    } else {
      setShowEmptyReflectionAlert(true);
    }
  }

  function handleSubmission() {
    if (reflection && reflection.trim() !== "") {
      submitLabSheet(reflection);
    } else {
      setShowEmptyReflectionAlert(true);
    }
  }

  function handleReflectionOnChange(value: string) {
    setReflection(value);
  }

  return (
    <>
      <Content>
        {showEmptyAnswerAlert && (
          <Alert
            message={<p className="font-semibold text-bse">Please provide an answer before evaluating.</p>}
            type="error"
            showIcon
            closable
            onClose={() => setShowEmptyAnswerAlert(false)}
            className="mb-4"
          />
        )}
        <div className="bg-white flex flex-col mx-auto p-8 w-full max-w-[1200px] max-h-[800] h-max rounded-2xl">
          <Modal open={isSupportMaterialModelOpen} onCancel={() => setIsSupportMaterialModelOpen(false)} width={1000} footer={[]}>
            <SupportMaterialsForLab isNewTab={false} labSheetId={labSheetId} />
          </Modal>
          <form onSubmit={handleNextQuestion}>
            <div className="flex flex-row justify-between items-center flex-shrink-0">
              <h1 className="text-2xl font-bold my-2">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </h1>
              <Button className="w-max" onClick={() => setIsSupportMaterialModelOpen(true)}><FileMarkdownOutlined />Support Material</Button>
            </div>
            <p className="text-lg">{questions?.[currentQuestionIndex]?.question}</p>
            <div className="my-4">
              <div className="flex flex-col justify-center items-center">
                <CodeEditor handleCodeOnChange={handleCodeOnChange} currentSnippet={currentAnswer} />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-4 items-center justify-between">
                <p className="font-medium text-lg">
                  Number of attempts : {questions?.[currentQuestionIndex]?.attempts}
                </p>
              </div>
              {isAnsForCurrQuesCorrect === null ? <></> : isAnsForCurrQuesCorrect ? (
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
                  {questions?.[currentQuestionIndex]?.attempts >= 6 && !isAnsForCurrQuesCorrect && <Button type="text" className="text-red-500 flex flex-row gap-4" onClick={() => setShowAnswer(true)}>Show Answer</Button>}

                  {currentQuestionIndex === totalQuestions - 1 ? <Button
                    type="primary"
                    htmlType="button"
                    onClick={handleSubmission}
                  >
                    Submit Lab Sheet
                  </Button> : <Button
                    type="primary"
                    htmlType="button"
                    onClick={handleNextQuestion}
                  >
                    Next Question
                  </Button>}

                </div>
              ) : (
                <div className="flex flex-row gap-4">
                  {questions?.[currentQuestionIndex]?.attempts >= 3 &&
                    questions[currentQuestionIndex]?.attempts < 6 && (
                      <Button
                        type="default"
                        htmlType="button"
                        onClick={() => getHintForCurrentQuestion()}
                      >
                        Hint
                      </Button>
                    )}
                  <Button type="primary" htmlType="button" onClick={handleEvaluation}>
                    Evaluate Answer
                  </Button>
                </div>
              )}
            </div>
          </form>
          <div>
            {questions?.[currentQuestionIndex]?.attempts < 6 &&
              hintForCurrentQuestion && (
                <div className="my-4">
                  <p className="font-semibold my-2">Hint:</p>
                  <p>{hintForCurrentQuestion}</p>
                </div>
              )}
            {showAnswer
              &&
              <div className="my-4">
                <p className="font-semibold my-2">Answer:</p>
                <p>{questions?.[currentQuestionIndex]?.answer}</p>
              </div>
            }


          </div>
        </div>
      </Content>
      <Content>
        {
          questions && isAnsForCurrQuesCorrect && !questions[currentQuestionIndex].is_answer_submitted && (
            <div>
              {showEmptyReflectionAlert && (
                <Alert
                  message={<p className="font-semibold text-bse">Please provide a reflection before moving to the next question.</p>}
                  type="error"
                  showIcon
                  closable
                  onClose={() => setShowEmptyReflectionAlert(false)}
                  className="mb-4"
                />
              )}
              <ReflectionCardForLab onChange={handleReflectionOnChange} />
            </div>
          )
        }
      </Content>

    </>
  )
}