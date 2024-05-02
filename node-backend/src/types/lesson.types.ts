export interface LessonOutlineType {
  lessonTitle: string;
  subtopics: string[];
  learningOutcomes: LearningOutcomeType[];
}

export interface LearningOutcomeType {
  outcome: string;
  bloomsLevels: string[];
}

export interface DetailedLessonOutlineType {
  subtopic: string;
  Description: string;
}
