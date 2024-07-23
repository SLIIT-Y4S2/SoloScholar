import { LessonOutlineType } from "../types/lesson.types";

const MODULE_OUTLINE_LESSON_ARRAY: LessonOutlineType[] = [
  {
    lessonTitle: "Query Processing and Optimization",
    subtopics: [
      "Query execution plans",
      "I/O Cost Estimation model",
      "Cost estimation for joining algorithms and sorting algorithms",
    ],
    learningOutcomes: [
      {
        outcome:
          "Describe the principles and techniques of query optimization, estimate the cost of query plans and database tuning.",
        bloomsLevels: ["Remembering", "Understanding"],
      },
    ],
  },
  {
    lessonTitle: "Indexing Techniques",
    subtopics: [
      "File organizations",
      "Properties of indexes",
      "Tree based B+ Tree Indexes",
      "Hash Indexes",
      "Bitmap Indexes",
    ],
    learningOutcomes: [
      {
        outcome:
          "Describe the principles and techniques of query optimization, estimate the cost of query plans and database tuning.",
        bloomsLevels: ["Remembering", "Understanding"],
      },
    ],
  },
  {
    lessonTitle: "Physical Database Design and Database Tuning",
    subtopics: [
      "Index selection and creation",
      "Index-Only Plans",
      "Query re-writing",
      "Data partitioning",
      "Tools for performance monitoring",
    ],
    learningOutcomes: [
      {
        outcome:
          "Describe the principles and techniques of query optimization, estimate the cost of query plans and database tuning.",
        bloomsLevels: ["Remembering", "Understanding"],
      },
    ],
  },
  {
    lessonTitle: "XML Databases",
    subtopics: ["Storing XML Data", "Querying XML Data", "XPath", "XQuery"],
    learningOutcomes: [
      {
        outcome:
          "Design and develop NoSQL and XML database systems for real world applications.",
        bloomsLevels: ["Creating"],
      },
    ],
  },
  {
    lessonTitle: "Crash Recovery Techniques",
    subtopics: [
      "Stealing Frames & Forcing Pages",
      "Write-Ahead Logging",
      "ARIES algorithm",
    ],
    learningOutcomes: [
      {
        outcome:
          "Recommend suitable transaction and concurrency control solutions for data intensive application.",
        bloomsLevels: ["Evaluating"],
      },
    ],
  },
  {
    lessonTitle: "Transactions and Concurrency Control",
    subtopics: [
      "Transaction properties",
      "Scheduling Transactions",
      "Anomalies with Interleaved Execution, Deadlocks",
      "Dynamic Databases & Phantoms",
      "Locking Algorithms",
    ],
    learningOutcomes: [
      {
        outcome:
          "Recommend suitable transaction and concurrency control solutions for data intensive application.",
        bloomsLevels: ["Remembering", "Understanding", "Evaluating"],
      },
    ],
  },
  {
    lessonTitle: "Parallel and Distributed Databases",
    subtopics: [
      "Parallel and Distributed Database architecture",
      "Parallel and Distributed Concurrency Control protocols",
    ],
    learningOutcomes: [
      {
        outcome:
          "Explain the concepts underlying in Distributed and Parallel RDBMS architectures and associate protocols for distributed transaction processing.",
        bloomsLevels: ["Understanding"],
      },
    ],
  },
  {
    lessonTitle: "Big Data and NoSQL Databases",
    subtopics: [
      "Differentiate a NoSQL database from the Relational Database Management System",
      "Use a NoSQL database, CAP theorem, BASE model",
      "Key-value databases",
      "Column Databases",
      "Document Databases and Graph databases",
      "NoSQL CURD Operations",
    ],
    learningOutcomes: [
      {
        outcome:
          "Design and develop NoSQL and XML database systems for real world applications.",
        bloomsLevels: ["Creating"],
      },
    ],
  },
  {
    lessonTitle: "Hadoop Framework",
    subtopics: [
      "Map-Reduce algorithm, Hadoop Architecture",
      "Installing and configuring Hadoop framework",
      "HDFS Architecture and HDFS operations",
      "MapReduce program model for distributed processing",
    ],
    learningOutcomes: [
      {
        outcome:
          "Utilize Hadoop framework and supporting tools to execute Map Reduce program model for distributed processing",
        bloomsLevels: ["Applying"],
      },
    ],
  },
  {
    lessonTitle: "Introduction to Big data Analytics",
    subtopics: [],
    learningOutcomes: [
      {
        outcome:
          "Utilize Hadoop framework and supporting tools to execute Map Reduce program model for distributed processing",
        bloomsLevels: ["Applying"],
      },
    ],
  },
];

export { MODULE_OUTLINE_LESSON_ARRAY };
