import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  getTutorialByIndex,
  requestFeedbackService,
  submitAnswerByQuestionId,
  submitTutorial,
} from "../services/tutorial.service";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
interface TutorialProviderProps {
  children: ReactNode;
}
export interface TutorialQuestion {
  id: number;
  question_number: number;
  question: string;
  options: string[];
  type: "essay" | "mcq";
  answer: string;
  student_answer: string | null;
  feedbackType?: "skip" | "basic" | "detailed";
  is_student_answer_correct?: boolean;
}
type TutorialStatus =
  | "generating"
  | "generated"
  | "in-progress"
  | "submitting"
  | "submitted"
  | "feedback-generating"
  | "feedback-generated"
  | "ended";

interface TutorialContextType {
  questions: TutorialQuestion[];
  status?: TutorialStatus;
  current_question: number;
  isLoading: boolean;
  error: string | null;
  studentsAnswerForTheCurrentQuestion: string | null;

  setStudentsAnswerForTheCurrentQuestion: (answer: string | null) => void;
  submitAnswer: (current: number, next: number | null) => void;
  requestFeedback: (questionFeedback: { [key: string]: string }[]) => void;
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
  const { tutorialId } = useParams();

  const [status, setStatus] = useState<TutorialStatus | undefined>();
  const [current_question, set_current_question] = useState<number>(1);
  const [questions, setQuestions] = useState<TutorialQuestion[]>([]);
  const [
    studentsAnswerForTheCurrentQuestion,
    setStudentsAnswerForTheCurrentQuestion,
  ] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const displayedQuestion = questions[current_question - 1];

  useEffect(() => {
    if (current_question === 0) return;
    setStudentsAnswerForTheCurrentQuestion(displayedQuestion?.student_answer);
  }, [displayedQuestion?.student_answer, current_question, questions]);

  useEffect(() => {
    setIsLoading(true);
    // fetch the questions from the backend
    if (!tutorialId) return;
    const fetchQuestions = async () => {
      try {
        const tutorial = await getTutorialByIndex(tutorialId);
        setQuestions(tutorial.questions);
        setStatus(tutorial.status);
        set_current_question(tutorial.current_question);
        setIsLoading(false);
      } catch (error) {
        if ((error as AxiosError).response?.status === 404) {
          setError("Tutorial not found");
        }
        if ((error as AxiosError).response?.status === 403) {
          setError("You are not authorized to view this tutorial");
        }
        if ((error as AxiosError).response?.data) {
          const data = (error as AxiosError).response?.data as {
            message: string;
          };
          setError(data.message);
        }

        setIsLoading(false);
      }
    };
    fetchQuestions();
  }, [tutorialId]);

  if (tutorialId === undefined) {
    return <div>Invalid tutorial ID</div>;
  }

  const submitAnswer = async (current: number, next: number | null) => {
    const currentQuestionId = questions[current - 1].id;
    if (next === null) {
      // If next is null, it means the user is submitting the tutorial
      setStatus("submitting");
      const tutorial = await submitTutorial(
        tutorialId,
        currentQuestionId,
        studentsAnswerForTheCurrentQuestion
      );
      setQuestions(tutorial.questions);
      set_current_question(1);
      setStatus(tutorial.status);
      setStudentsAnswerForTheCurrentQuestion(null);

      return;
    }

    if (next < 1 || next > questions.length) return;

    if (
      studentsAnswerForTheCurrentQuestion !== displayedQuestion?.student_answer
    ) {
      try {
        const result = await submitAnswerByQuestionId(
          tutorialId,
          currentQuestionId,
          studentsAnswerForTheCurrentQuestion,
          next
        );
        updateQuestionAnswer(current);
        set_current_question(result.current_question);
        return;
      } catch (error) {
        console.error(error);
        return;
      }
    } else {
      set_current_question(next);
    }
  };

  const updateQuestionAnswer = (questionNumber: number) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.question_number === questionNumber
          ? { ...q, student_answer: studentsAnswerForTheCurrentQuestion }
          : q
      )
    );
  };

  const requestFeedback = async (
    questionFeedback: { [key: string]: string }[]
  ) => {
    setStatus("feedback-generating");
    const tutorial = await requestFeedbackService(tutorialId, questionFeedback);
    setQuestions(tutorial.questions);
    setStatus(tutorial.status);
  };

  return (
    <TutorialProviderContext.Provider
      value={{
        questions,
        isLoading,
        current_question,
        studentsAnswerForTheCurrentQuestion,
        setStudentsAnswerForTheCurrentQuestion,
        submitAnswer,
        status,
        requestFeedback,
        error,
      }}
    >
      {children}
    </TutorialProviderContext.Provider>
  );
}
