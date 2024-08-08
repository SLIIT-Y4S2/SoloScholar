import { useState } from "react";
import { useLabSessionContext } from "../../provider/lab/LabSessionContext";
import { Button, Input, Layout, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

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

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    console.log(currentAnswer);

    if (currentAnswer && currentAnswer.trim() !== "") {
      evaluateStudentAnswerHandler(currentAnswer);
    } else {
      alert("Please provide an answer");
    }
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
        {!isLabCompleted ? (
          <form className="" onSubmit={handleNextQuestion}>
            <h1 className="text-2xl font-bold my-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h1>
            <p>{questions && questions[currentQuestionIndex].question}</p>
            <div className="my-4">
              <p className="font-semibold my-2">
                Provide your answer in below text box.
              </p>
              <TextArea
                className="overflow-visible bg-sky-950 text-white w-full p-4 custom-scrollbar hover:bg-sky-950 focus:bg-sky-950"
                value={currentAnswer}
                onChange={(event) => setCurrentAnswer(event.target.value)}
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
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
                      onClick={getHintForCurrentQuestion}
                    >
                      Hint
                    </Button>
                  )}
                {questions && questions[currentQuestionIndex].attempts >= 6 && (
                  <Button type="text" className="text-red-500">Show Answer</Button>
                )}
              </div>
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
                // ref={''}
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
