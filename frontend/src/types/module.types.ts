interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  title: string;
  description: string;
  subtopics: string[];
  learning_outcomes: LearningOutcome[];
}

interface LearningOutcome {
  outcome: string;
  cognitive_level: CognitiveLevel[];
}

type CognitiveLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Evaluate"
  | "Create";

export type { Module, Lesson, LearningOutcome, CognitiveLevel };
