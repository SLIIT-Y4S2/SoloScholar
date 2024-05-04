import { LessonOutlineType } from "../types/lesson.types";

export const DUMMY_LESSON_OUTLINE: LessonOutlineType = {
  lessonTitle: "Transactions and Concurrency Control",
  subtopics: [
    "Transaction properties",
    "Scheduling Transactions",
    "Anomalies with Interleaved Execution",
    "Deadlocks",
    "Dynamic Databases & Phantoms",
    "Locking Algorithms",
  ],
  learningOutcomes: [
    {
      outcome:
        "Recommend suitable transaction and concurrency control solutions for data intensive application.",
      bloomsLevels: ["Remembering", "Understanding"],
    },
  ],
};

const LectureModule = {
  moduleName: "Database Systems",
  lessons: [
    {
      lessonTitle: "Transactions and Concurrency Control",
      subtopics: [
        "Transaction properties",
        "Scheduling Transactions",
        "Anomalies with Interleaved Execution",
        "Deadlocks",
        "Dynamic Databases & Phantoms",
        "Locking Algorithms",
      ],
      learningOutcomes: [
        {
          outcome:
            "Recommend suitable transaction and concurrency control solutions for data intensive application.",
          bloomsLevels: ["Remembering", "Understanding"],
        },
      ],
    },
  ],
};
