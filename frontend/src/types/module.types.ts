interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  lesson_subtopics: lesson_subtopic[];
  learning_outcomes: LearningOutcome[];
}

interface lesson_subtopic {
  topic: string;
  description: string;
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
