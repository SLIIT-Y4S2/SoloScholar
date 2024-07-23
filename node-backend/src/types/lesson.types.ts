export interface LessonOutlineType {
  title: string;
  lesson_subtopic: string[];
  lesson_learning_outcome: LearningOutcomeType[];
}

export interface LearningOutcomeType {
  outcome: string;
  cognitive_level: string[];
}

export interface DetailedLessonOutlineType {
  subtopic: string;
  Description: string;
}
