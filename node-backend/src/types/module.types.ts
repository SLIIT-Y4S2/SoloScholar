interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  sub_lessons: SubLesson[];
  lesson_learning_outcomes: LearningOutcome[];
}

interface SubLesson {
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
  | "Analyze"
  | "Evaluate"
  | "Create";

type SubtopicWithoutDescription = Omit<SubLesson, "description">;

type InputLesson = Omit<Lesson, "sub_lessons"> & {
  sub_lessons: string[];
};

type InputModule = Omit<Module, "lessons"> & {
  lessons: InputLesson[];
};

export type {
  Module,
  Lesson,
  SubLesson,
  LearningOutcome,
  CognitiveLevel,
  InputModule,
  InputLesson,
};
