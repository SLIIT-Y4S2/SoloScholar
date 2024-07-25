interface Module {
  name: string;
  description: string;
  lessons: Lesson[];
}

interface Lesson {
  id: number;
  title: string;
  description: string;
  lesson_subtopics: LessonSubtopic[];
  lesson_learning_outcomes: LearningOutcome[];
}

interface LessonSubtopic {
  topic: string;
  description: string;
}

interface LearningOutcome {
  outcome: string;
  cognitive_levels: CognitiveLevel[];
}

type CognitiveLevel =
  | "Remember"
  | "Understand"
  | "Apply"
  | "Analyze"
  | "Evaluate"
  | "Create";

type SubtopicWithoutDescription = Omit<LessonSubtopic, "description">;

type InputLesson = Omit<Lesson, "lesson_subtopics"> & {
  lesson_subtopics: SubtopicWithoutDescription[];
};

type InputModule = Omit<Module, "lessons"> & {
  lessons: InputLesson[];
};

export type {
  Module,
  Lesson,
  LessonSubtopic,
  LearningOutcome,
  CognitiveLevel,
  InputModule,
  InputLesson,
};
