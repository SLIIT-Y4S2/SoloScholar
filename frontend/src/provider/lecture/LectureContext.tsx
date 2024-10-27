import { createContext, ReactNode, useEffect, useState } from "react";
import {
  getLectureByIndex,
  submitAnswerByQuestionId,
  completeLectureService,
  updateSubLectureCompletion
  
} from "../../services/lecture.service";
import { useParams } from "react-router-dom";
import { AxiosError } from "axios";
import { message } from "antd";

interface LectureProviderProps {
  children: ReactNode;
}
interface LectureContextType {
  markSubLectureAsCompleted: (subLectureId: number) => Promise<void>;
}

export interface Lecture {
  score(score: any): unknown;
  isCompleted: Lecture | null;
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
  learning_level: "beginner" | "intermediate" | "advanced";
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
  selectedKey: string;
  current_sub_lecture: number;
  currentSubLectureContent: string | null;
  currentSubLectureTopic: string | null;
  isFetching: boolean;
  isLoading: boolean;
  error: string | null;
  studentsAnswerForTheCurrentQuestion: string | null;

  setStudentsAnswerForTheCurrentQuestion: (answer: string | null) => void;
  submitAnswer: (current: number, next: number | null) => void;
  completeLecture: () => void;
  setCurrentSubLectureContent: (content: string | null) => void;
  setCurrentSubLectureTopic: (topic: string | null) => void; // Add this line
  setSelectedKey: (key: string) => void;
}

export const LectureProviderContext = createContext<LectureContextType | null>(null);

export function LectureProvider({ children }: LectureProviderProps) {
  const { lectureId } = useParams();

  const [currentSubLectureContent, setCurrentSubLectureContent] = useState<string | null>(null);

  const [lecture, setLecture] = useState<Lecture | null>(null);

  const [selectedKey, setSelectedKey] = useState<string>("sub1");
  const [currentSubLectureTopic, setCurrentSubLectureTopic] = useState<string | null>(null);



  const [current_sub_lecture, setCurrentSubLecture] = useState<number>(1);
  const [studentsAnswerForTheCurrentQuestion, setStudentsAnswerForTheCurrentQuestion] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  const displayedSubLecture = lecture?.sub_lecture[current_sub_lecture - 1];

  const markSubLectureAsCompleted = async (subLectureId: number) => {
    if (!lecture?.id) return;
    
    try {
      await updateSubLectureCompletion(lecture.id, subLectureId.toString(), true);
      
      // Update local state to reflect the change
      setLecture((prevLecture) => 
        prevLecture ? {
          ...prevLecture,
          sub_lecture: prevLecture.sub_lecture.map((sub) =>
            sub.id === subLectureId ? { ...sub, is_completed: true } : sub
          )
        } : null
      );
      
      messageApi.success("Lecture marked as completed");
    } catch (error) {
      messageApi.error("Failed to mark lecture as completed");
      console.error("Error marking lecture as completed:", error);
    }
  };

  useEffect(() => {
    setIsFetching(true);
    if (!lectureId) return;
    const fetchLecture = async () => {
      try {
        const lectureData = await getLectureByIndex(lectureId);
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



  const completeLecture = async () => {
    try {
      setIsFetching(true);
      const lectureData = await completeLectureService(lectureId);
      setLecture(lectureData);
      setIsFetching(false);
    } catch (error) {
      setIsFetching(false);
      messageApi.error("An error occurred while completing the lecture");
    }
  };

  return (
    <LectureProviderContext.Provider
      value={{
        lecture,
        isFetching,
        isLoading,
        current_sub_lecture,
        currentSubLectureContent,
        studentsAnswerForTheCurrentQuestion,
        currentSubLectureTopic,
        setStudentsAnswerForTheCurrentQuestion,
        submitAnswer,
        status: lecture?.status,
        error,
        completeLecture,
        setCurrentSubLectureContent,
        selectedKey,
        setSelectedKey,
        setCurrentSubLectureTopic,
        markSubLectureAsCompleted,
      }}
    >
      {contextHolder}
      {children}
    </LectureProviderContext.Provider>
  );
}
