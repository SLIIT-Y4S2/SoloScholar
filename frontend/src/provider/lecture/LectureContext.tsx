import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getLectureByIndex,
  submitAnswerByQuestionId,
  requestFeedbackService,
  completeLectureService,
} from "../../services/lecture.service"; // Assuming these services are implemented
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { message } from "antd";

interface LectureProviderProps {
  children: ReactNode;
}

export interface Lecture {
  id: string;
  status: LectureStatus;
  learning_material: {
    id: string;
    learning_level: "beginner" | "intermediate" | "advanced";
    completion_status: string;
    created_at: string;
    updated_at: string;
    learner_id: string;
    lesson_id: number;
    lesson: {
      id: number;
      title: string;
      description: string;
      module_id: number;
    };
  };
  sub_lecture: SubLecture[];
  assessment_question: AssessmentQuestion[];
}

export interface SubLecture {
  id: number;
  topic: string;
  content: string;
  is_completed: boolean;
  lecture_id: string;
}

export interface AssessmentQuestion {
  id: number;
  type: "pre" | "post";
  question: string;
  question_number: number;
  answer: string;
  student_answer: string | null;
  lecture_id: string;
  options: string[];
}

export type LectureStatus =
  | "generating"
  | "generated"
  | "in-progress"
  | "completed"
  | "submitted";

interface LectureContextType {
  lecture: Lecture | null;
  status?: LectureStatus;
  current_sub_lecture: number;
  isFetching: boolean;
  isLoading: boolean;
  error: string | null;
  studentsAnswerForTheCurrentQuestion: string | null;

  setStudentsAnswerForTheCurrentQuestion: (answer: string | null) => void;
  submitAnswer: (current: number, next: number | null) => void;
  requestFeedback: (questionFeedback: { [key: string]: string }[]) => void;
  completeLecture: () => void;
}

export const LectureProviderContext = createContext<LectureContextType | null>(null);

export function LectureProvider({ children }: LectureProviderProps) {
  const { lectureId } = useParams();

  const [lecture, setLecture] = useState<Lecture | null>(null);
  const [current_sub_lecture, setCurrentSubLecture] = useState<number>(1);
  const [studentsAnswerForTheCurrentQuestion, setStudentsAnswerForTheCurrentQuestion] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const displayedSubLecture = lecture?.sub_lecture[current_sub_lecture - 1];

  // useEffect(() => {
  //   if (current_sub_lecture === 0) return;
  //   setStudentsAnswerForTheCurrentQuestion(displayedSubLecture?.content || null);
  // }, [displayedSubLecture, current_sub_lecture]);

  useEffect(() => {
    setIsFetching(true);
    if (!lectureId) return;
    const fetchLecture = async () => {
      try {
        const lectureData = await getLectureByIndex(lectureId);
        console.log("lectureData:", lectureData);
        setLecture(lectureData);
        setIsFetching(false);
      } catch (error) {
        if ((error as AxiosError).response?.status === 404) {
          setError("Lecture not found");
        } else if ((error as AxiosError).response?.status === 403) {
          setError("You are not authorized to view this lecture");
        } else {
          const data = (error as AxiosError).response?.data as { message: string };
          setError(data.message);
        }
        setIsFetching(false);
      }
    };
    fetchLecture();
  }, [lectureId]);

  if (lectureId === undefined) {
    return <div>Invalid lecture ID {lectureId}</div>;
  }

  const submitAnswer = async (current: number, next: number | null) => {
    try {
      setIsLoading(true);
      const currentQuestionId = lecture?.assessment_question[current - 1].id;
      if (next === null) {
        const lectureData = await completeLectureService(lectureId);
        setLecture(lectureData);
        setCurrentSubLecture(1);
        setStudentsAnswerForTheCurrentQuestion(null);
        setIsLoading(false);
        return;
      }

      if (next < 1 || next > lecture!.sub_lecture.length) return;

      if (studentsAnswerForTheCurrentQuestion !== displayedSubLecture?.content) {
        const result = await submitAnswerByQuestionId(
          lectureId,
          currentQuestionId!,
          studentsAnswerForTheCurrentQuestion,
          next
        );
        updateQuestionAnswer(current);
        setCurrentSubLecture(result.current_sub_lecture);
        setIsLoading(false);
        return;
      } else {
        setCurrentSubLecture(next);
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
    setLecture((prevLecture) =>
      prevLecture
        ? {
            ...prevLecture,
            assessment_question: prevLecture.assessment_question.map((q) =>
              q.question_number === questionNumber
                ? { ...q, student_answer: studentsAnswerForTheCurrentQuestion }
                : q
            ),
          }
        : null
    );
  };

  const requestFeedback = async (questionFeedback: { [key: string]: string }[]) => {
    try {
      const lectureData = await requestFeedbackService(lectureId, questionFeedback);
      setLecture(lectureData);
    } catch (error) {
      messageApi.error("An error occurred while requesting feedback");
      console.error(error);
    }
  };

  const completeLecture = async () => {
    try {
      setIsFetching(true);
      const lectureData = await completeLectureService(lectureId);
      setLecture(lectureData);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      messageApi.error("An error occurred while completing the lecture");
      console.error(error);
    }
  };

  return (
    <LectureProviderContext.Provider
      value={{
        lecture,
        isFetching,
        isLoading,
        current_sub_lecture,
        studentsAnswerForTheCurrentQuestion,
        setStudentsAnswerForTheCurrentQuestion,
        submitAnswer,
        status: lecture?.status,
        requestFeedback,
        error,
        completeLecture,
      }}
    >
      {contextHolder}
      {children}
    </LectureProviderContext.Provider>
  );
}
