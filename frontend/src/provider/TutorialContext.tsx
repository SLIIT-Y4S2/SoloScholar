import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import dummyQuestions from "../dummyData/tutorialQuestions.json";
interface TutorialProviderProps {
  children: ReactNode;
}
export interface TutorialQuestion {
  questionNumber: number;
  question: string;
  options: string[];
  type: "short-answer" | "mcq";
  answer: string;
  studentAnswer: string | null;
  feedbackType?: "skip" | "basic" | "detailed";
  isStudentAnswerCorrect?: boolean;
}
type TutorialStatus =
  | "generating"
  | "generated"
  | "submitted"
  | "feedback-generating"
  | "feedback-generated"
  | "ended";

interface TutorialContextType {
  questions: TutorialQuestion[];
  status?: TutorialStatus;
  currentQuestionNumber: number;
  isLoading: boolean;
  studentsAnswerForTheCurrentQuestion: string | null;
  setStudentsAnswerForTheCurrentQuestion: (answer: string | null) => void;

  submitAnswer: (
    currentQuestion: number,
    nextQuestionNumber: number | null
  ) => void;
}

const TutorialProviderContext = createContext<TutorialContextType | null>(null);

export function useTutorialContext() {
  const value = useContext(TutorialProviderContext);
  if (!value) {
    throw new Error(
      "useTutorialProvider must be used within a TutorialProvider"
    );
  }
  return value;
}

export function TutorialProvider({ children }: TutorialProviderProps) {
  const [status, setStatus] = useState<TutorialStatus | undefined>();
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [questions, setQuestions] = useState<TutorialQuestion[]>([]);
  const [
    studentsAnswerForTheCurrentQuestion,
    setStudentsAnswerForTheCurrentQuestion,
  ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const displayedQuestion = questions[currentQuestionNumber - 1];

  useEffect(() => {
    if (currentQuestionNumber === 0) return;
    setStudentsAnswerForTheCurrentQuestion(displayedQuestion?.studentAnswer);
  }, [displayedQuestion?.studentAnswer, currentQuestionNumber, questions]);

  useEffect(() => {
    setIsLoading(true);
    // fetch the questions from the backend
    setTimeout(() => {
      setStatus("generated");
      setQuestions(
        dummyQuestions.map((question, index) => {
          const type: "mcq" | "short-answer" =
            question.type === "mcq" || question.type === "short-answer"
              ? question.type
              : "short-answer";
          return {
            questionNumber: index + 1,
            question: question.question,
            options: question.options ?? [],
            type,
            studentAnswer: null,
            answer: question.answer,
            // isStudentAnswerCorrect: true,
          };
        })
      );
      setCurrentQuestionNumber(1);
      setIsLoading(false);
    }, 1000);
  }, []);

  const submitAnswer = async (
    currentQuestion: number,
    nextQuestionNumber: number | null
  ) => {
    if (nextQuestionNumber === null) {
      //TODO finish the tutorial
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentQuestionNumber(1);
      setStatus("submitted");
      return;
    }

    if (nextQuestionNumber < 1 || nextQuestionNumber > questions.length) return;
    if (
      studentsAnswerForTheCurrentQuestion !== displayedQuestion?.studentAnswer
    ) {
      //TODO submit the answer to the backend with next question number as current question
      await new Promise((resolve) => setTimeout(resolve, 1000));
      displayedQuestion.studentAnswer = studentsAnswerForTheCurrentQuestion;

      // TODO: If submitting the answer to the backend is successful, then only change the question
      setCurrentQuestionNumber(nextQuestionNumber);
    } else {
      // change the question to next or given number
      setCurrentQuestionNumber(nextQuestionNumber);
    }
  };

  //

  return (
    <TutorialProviderContext.Provider
      value={{
        questions,
        isLoading,
        currentQuestionNumber,
        studentsAnswerForTheCurrentQuestion,
        setStudentsAnswerForTheCurrentQuestion,
        submitAnswer,
        status,
      }}
    >
      {children}
    </TutorialProviderContext.Provider>
  );
}
