export interface TutorialQuestion {
  question_number: number;
  question: string;
  options: string[];
  type: "short-answer" | "mcq";
  answer: string;
  student_answer: string | null;
  feedbackType?: "skip" | "basic" | "detailed";
  is_student_answer_correct?: boolean;
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
  created_at: Date;
  // updatedAt: Date;
}
