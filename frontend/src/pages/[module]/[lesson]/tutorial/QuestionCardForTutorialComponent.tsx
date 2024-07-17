import { Content } from "antd/es/layout/layout";
import { useTutorialContext } from "../../../../provider/TutorialContext";
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
        options.map((option) => (
          <div
            key={option}
            onClick={() => setStudentsAnswerForTheCurrentQuestion(option)}
            className={`p-2 border rounded-lg cursor-pointer ${
              studentsAnswerForTheCurrentQuestion === option
                ? "bg-blue-200"
                : ""
            }`}
          >
            {option}
          </div>
        ))
      )}
      <Button onClick={() => submitAnswer(questionNumber, questionNumber - 1)}>
        Previous
      </Button>
      <Button onClick={() => submitAnswer(questionNumber, questionNumber + 1)}>
        Next
      </Button>
    </Content>
  );
};

export default QuestionCardForTutorialComponent;
