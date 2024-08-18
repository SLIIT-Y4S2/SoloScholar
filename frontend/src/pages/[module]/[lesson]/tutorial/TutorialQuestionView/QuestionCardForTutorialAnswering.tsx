import { Content } from "antd/es/layout/layout";
import { Button } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useTutorialContext } from "../../../../../provider/tutorial/useTutorialContext";

const QuestionCardForTutorialAnswering = () => {
  // const [selectedOption, setSelectedOption] = useState<string | null>(null);

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
            setStudentsAnswerForTheCurrentQuestion(e.target.value)
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
          <Button
            type="primary"
            onClick={() => submitAnswer(question_number, null)}
          >
            Finish
          </Button>
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
