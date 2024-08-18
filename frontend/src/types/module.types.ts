interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  sub_lessons: sub_lesson[];
  lesson_learning_outcomes: LearningOutcome[];
}

interface sub_lesson {
  topic: string;
  description: string;
}

interface LearningOutcome {
  outcome: string;
  cognitive_level: CognitiveLevel;
}

type CognitiveLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Evaluate"
  | "Create";

export type { Module, Lesson, LearningOutcome, CognitiveLevel };
