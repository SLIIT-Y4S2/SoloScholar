import { Content } from "antd/es/layout/layout";
import { useTutorialContext } from "../../../../../provider/TutorialContext";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";

const QuestionCardForTutorialComponent = () => {
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const {
    submitAnswer,
    questions,
    currentQuestionNumber,
    studentsAnswerForTheCurrentQuestion,
    setStudentsAnswerForTheCurrentQuestion,
    isLoading,
  } = useTutorialContext();

  const { question, options, questionNumber, type } =
    questions[currentQuestionNumber - 1];

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
        {questionNumber}. {question}
      </h1>
      {type === "short-answer" ? (
        <TextArea
          value={studentsAnswerForTheCurrentQuestion || ""}
          onChange={(e) =>
            setStudentsAnswerForTheCurrentQuestion(e.target.value)
          }
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
        {currentQuestionNumber !== questions.length && (
          <Button
            type="primary"
            onClick={() => submitAnswer(questionNumber, questionNumber + 1)}
          >
            Next
          </Button>
        )}

        {currentQuestionNumber === questions.length && (
          <Button
            type="primary"
            onClick={() => submitAnswer(questionNumber, null)}
          >
            Finish
          </Button>
        )}

        {currentQuestionNumber !== 1 && (
          <Button
            onClick={() => submitAnswer(questionNumber, questionNumber - 1)}
          >
            Previous
          </Button>
        )}
      </div>
    </Content>
  );
};

export default QuestionCardForTutorialComponent;
