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
  studentAnswer: string | null;
}

interface TutorialContextType {
  questions: TutorialQuestion[];
  currentQuestionNumber: number;
  isLoading: boolean;
  studentsAnswerForTheCurrentQuestion: string | null;
  setStudentsAnswerForTheCurrentQuestion: (answer: string | null) => void;
  submitAnswer: (currentQuestion: number, nextQuestionNumber: number) => void;
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
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState<number>(1);
  const [questions, setQuestions] = useState<TutorialQuestion[]>([]);
  const [
    studentsAnswerForTheCurrentQuestion,
    setStudentsAnswerForTheCurrentQuestion,
  ] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (currentQuestionNumber === 0) return;
    setStudentsAnswerForTheCurrentQuestion(
      questions[currentQuestionNumber - 1].studentAnswer
    );
  }, [currentQuestionNumber, questions]);

  useEffect(() => {
    setIsLoading(true);
    // fetch the questions from the backend
    setTimeout(() => {
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
          };
        })
      );
      setCurrentQuestionNumber(1);
      setIsLoading(false);
    }, 1000);
  }, []);

  const submitAnswer = async (
    currentQuestion: number,
    nextQuestionNumber: number
  ) => {
    if (nextQuestionNumber < 1 || nextQuestionNumber > questions.length) return;
    if (
      studentsAnswerForTheCurrentQuestion !==
      questions[currentQuestion - 1].studentAnswer
    ) {
      //TODO submit the answer to the backend with next question number as current question
      await new Promise((resolve) => setTimeout(resolve, 1000));
      questions[currentQuestion - 1].studentAnswer =
        studentsAnswerForTheCurrentQuestion;

      // TODO: If submitting the answer to the backend is successful, then only change the question
      setCurrentQuestionNumber(nextQuestionNumber);
    } else {
      // change the question to next or given number
      setCurrentQuestionNumber(nextQuestionNumber);
    }
  };

  return (
    <TutorialProviderContext.Provider
      value={{
        questions,
        isLoading,
        currentQuestionNumber,
        studentsAnswerForTheCurrentQuestion,
        setStudentsAnswerForTheCurrentQuestion,
        submitAnswer,
      }}
    >
      {children}
    </TutorialProviderContext.Provider>
  );
}
