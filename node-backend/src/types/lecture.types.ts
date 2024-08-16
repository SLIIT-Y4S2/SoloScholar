export interface LectureQuestion {
    question_number: number;
    question: string;
    options: string[];
    type: "short-answer" | "mcq";
    answer: string;
    student_answer: string | null;
    feedbackType?: "skip" | "basic" | "detailed";
    is_student_answer_correct?: boolean;
  }
  type LectureStatus =
    | "generating"
    | "generated"
    | "submitted"
    | "feedback-generating"
    | "feedback-generated"
    | "ended";
  
  export interface Lecture {
    id: string;
    lessonId: string;
    learnerId: string;
    questions: LectureQuestion[];
    status: LectureStatus;
    created_at: Date;
    updatedAt: Date;
  }
  