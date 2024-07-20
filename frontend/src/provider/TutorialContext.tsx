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
  submitAnswer: (current: number, next: number | null) => void;
  requestFeedback: (
    questionFeedback: {
      questionNumber: number;
      feedbackType: string;
    }[]
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
          const type =
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
            isStudentAnswerCorrect: true,
          };
        })
      );
      setCurrentQuestionNumber(1);
      setIsLoading(false);
    }, 1000);
  }, []);

  const submitAnswer = async (current: number, next: number | null) => {
    if (next === null) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: Finish the tutorial
      updateQuestionAnswer(current);
      setCurrentQuestionNumber(1);
      setStatus("submitted");
      return;
    }

    if (next < 1 || next > questions.length) return;

    if (
      studentsAnswerForTheCurrentQuestion !== displayedQuestion?.studentAnswer
    ) {
      await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: Submit answer to backend
      updateQuestionAnswer(current);
    }

    setCurrentQuestionNumber(next); // TODO: Change question only if submission is successful
  };

  const updateQuestionAnswer = (questionNumber: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.questionNumber === questionNumber
          ? { ...q, studentAnswer: studentsAnswerForTheCurrentQuestion }
          : q
      )
    );
  };

  const requestFeedback = async (
    questionFeedback: { questionNumber: number; feedbackType: string }[]
  ) => {
    setStatus("feedback-generating");
    await new Promise((resolve) => setTimeout(resolve, 1000)); // TODO: Request feedback from backend
    console.log(questionFeedback);

    setStatus("feedback-generated");
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
        status,
        requestFeedback,
      }}
    >
      {children}
    </TutorialProviderContext.Provider>
  );
}
