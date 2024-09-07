import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getTutorialByIndex,
  requestFeedbackService,
  submitAnswerByQuestionId,
  submitTutorial,
  completeTutorialService,
} from "../../services/tutorial.service";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { message } from "antd";
interface TutorialProviderProps {
  children: ReactNode;
}

export interface Tutorial {
  id: number;
  status: TutorialStatus;
  current_question: number;
  created_at: string;
  learning_level: "beginner" | "intermediate" | "advanced";
}

export interface TutorialQuestion {
  id: number;
  question_number: number;
  question: string;
  options: string[];
  type: "short-answer" | "mcq";
  answer: string;
  student_answer: string | null;
  hint?: string;
  feedback_type?: "skip" | "basic" | "detailed";
  feedback?: string;
  is_student_answer_correct?: boolean;
}
export type TutorialStatus =
  | "generating"
  | "generated"
  | "in-progress"
  | "submitting"
  | "submitted"
  | "feedback-generating"
  | "feedback-generated"
  | "completed";

interface TutorialContextType {
  questions: TutorialQuestion[];
  status?: TutorialStatus;
  current_question: number;
  isFetching: boolean;
  isLoading: boolean;
  error: string | null;
  studentsAnswerForTheCurrentQuestion: string | null;

  setStudentsAnswerForTheCurrentQuestion: (answer: string | null) => void;
  submitAnswer: (current: number, next: number | null) => void;
  requestFeedback: (questionFeedback: { [key: string]: string }[]) => void;
  completeTutorial: () => void;
}

export const TutorialProviderContext =
  createContext<TutorialContextType | null>(null);

export function TutorialProvider({ children }: TutorialProviderProps) {
  const { tutorialId } = useParams();

  const [status, setStatus] = useState<TutorialStatus | undefined>();
  const [current_question, set_current_question] = useState<number>(1);
  const [questions, setQuestions] = useState<TutorialQuestion[]>([]);
  const [
    studentsAnswerForTheCurrentQuestion,
    setStudentsAnswerForTheCurrentQuestion,
  ] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const displayedQuestion = questions[current_question - 1];

  useEffect(() => {
    if (current_question === 0) return;
    setStudentsAnswerForTheCurrentQuestion(displayedQuestion?.student_answer);
  }, [displayedQuestion?.student_answer, current_question, questions]);

  useEffect(() => {
    setIsFetching(true);
    // fetch the questions from the backend
    if (!tutorialId) return;
    const fetchQuestions = async () => {
      try {
        const tutorial = await getTutorialByIndex(tutorialId);
        setQuestions(tutorial.questions);
        setStatus(tutorial.status);
        set_current_question(tutorial.current_question);
        setIsFetching(false);
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

        setIsFetching(false);
      }
    };
    fetchQuestions();
  }, [tutorialId]);

  if (tutorialId === undefined) {
    return <div>Invalid tutorial ID</div>;
  }

  const submitAnswer = async (current: number, next: number | null) => {
    try {
      setIsLoading(true);
      const currentQuestionId = questions[current - 1].id;
      if (next === null) {
        // If next is null, it means the user is submitting the tutorial
        setStatus("submitting"); //TODO: check on this
        const tutorial = await submitTutorial(
          tutorialId,
          currentQuestionId,
          studentsAnswerForTheCurrentQuestion
        );
        setQuestions(tutorial.questions);
        set_current_question(1);
        setStatus(tutorial.status);
        setStudentsAnswerForTheCurrentQuestion(null);
        setIsLoading(false);
        return;
      }

      if (next < 1 || next > questions.length) return;

      if (
        studentsAnswerForTheCurrentQuestion !==
        displayedQuestion?.student_answer
      ) {
        const result = await submitAnswerByQuestionId(
          tutorialId,
          currentQuestionId,
          studentsAnswerForTheCurrentQuestion,
          next
        );
        updateQuestionAnswer(current);
        set_current_question(result.current_question);
        setStatus(result.status);
        setIsLoading(false);
        return;
      } else {
        set_current_question(next);
      }
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      messageApi.error("An error occurred while submitting your answer");
      return;
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
    try {
      setStatus("feedback-generating");
      const tutorial = await requestFeedbackService(
        tutorialId,
        questionFeedback
      );
      setQuestions(tutorial.questions);
      setStatus(tutorial.status);
    } catch (error) {
      messageApi.error("An error occurred while requesting feedback");
      console.error(error);
    }
  };

  const completeTutorial = async () => {
    try {
      setIsFetching(true);
      const tutorial = await completeTutorialService(tutorialId);
      setStatus(tutorial.status);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      messageApi.error("An error occurred while completing the tutorial");
      console.error(error);
    }
  };

  return (
    <TutorialProviderContext.Provider
      value={{
        questions,
        isFetching,
        isLoading,
        current_question,
        studentsAnswerForTheCurrentQuestion,
        setStudentsAnswerForTheCurrentQuestion,
        submitAnswer,
        status,
        requestFeedback,
        error,
        completeTutorial,
      }}
    >
      {contextHolder}
      {children}
    </TutorialProviderContext.Provider>
  );
}
