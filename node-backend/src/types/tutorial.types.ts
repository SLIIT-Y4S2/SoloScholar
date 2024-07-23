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

export interface Tutorial {
  id: string;
  lessonId: string;
  learnerId: string;
  questions: TutorialQuestion[];
  status: TutorialStatus;
  create_at: Date;
  updatedAt: Date;
}
