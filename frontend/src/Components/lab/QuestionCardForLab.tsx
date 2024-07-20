import { useRef } from "react";
import { useLabContext } from "../../provider/LabContext";
import { Button, Input, Layout, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { TextAreaRef } from "antd/es/input/TextArea";

const { Content } = Layout;
const { TextArea } = Input;

export default function QuestionCardForLab() {
  const {
    isAnsForCurrQuesCorrect,
    currentQuestionIndex,
    totalQuestions,
    questions,
    evaluateAnswer,
    isLoading,
    hintForCurrentQuestion,
    getHintForCurrentQuestion,
    goToNextQuestion,
    isLabCompleted,
  } = useLabContext();

  const answerRef = useRef<TextAreaRef>(null);

  // TODO: Implement the handleSubmit function and backend logic
  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const answer = answerRef.current?.resizableTextArea?.textArea.value;
    if (answer && answer.trim() !== "") {
      evaluateAnswer(answer);
    } else {
      alert("Please provide an answer");
    }
  }

  function handleNextQuestion(event: React.FormEvent) {
    event.preventDefault();
    goToNextQuestion();
  }

  return (
    <Content>
      <div className="bg-white flex flex-col mx-auto p-8 w-full max-w-[1200px] max-h-[800] h-max rounded-2xl">
        {!isLabCompleted ? (
          <form className="" onSubmit={handleNextQuestion}>
            <h1 className="text-2xl font-bold my-2">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </h1>
            <p>{questions[currentQuestionIndex]?.question}</p>
            <div className="my-4">
              <p className="font-semibold my-2">
                Provide your answer in below text box.
              </p>
              <TextArea
                className="overflow-visible bg-sky-950 text-white w-full p-4 custom-scrollbar hover:bg-sky-950 focus:bg-sky-950"
                ref={answerRef}
                autoSize={{ minRows: 4, maxRows: 8 }}
              />
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-row gap-4 items-center justify-between">
                <p className="font-medium">
                  Number of attempts:{" "}
                  {questions[currentQuestionIndex]?.attempts}
                </p>
                {questions[currentQuestionIndex]?.attempts >= 3 &&
                  questions[currentQuestionIndex]?.attempts < 6 && (
                    <Button
                      type="primary"
                      htmlType="button"
                      onClick={getHintForCurrentQuestion}
                    >
                      Hint
                    </Button>
                  )}
                {questions[currentQuestionIndex]?.attempts >= 6 && (
                  <Button type="primary">Show Answer</Button>
                )}
              </div>
              {isLoading ? (
                <Spin
                  indicator={<LoadingOutlined spin />}
                  size="large"
                  className="border-white"
                />
              ) : questions[currentQuestionIndex]?.attempts >= 6 ||
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
