import { LearningLevel } from "./../types/learning-material.types";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { getChatModel } from "../utils/openai.util";
import {
  GenerateMultipleChoiceQuestionPrompt,
  GenerateShortAnswerQuestionPrompt,
  MarkShortAnswerQuestionPrompt,
  FeedbackForQuestionPrompt,
} from "../prompt-templates/tutorial.prompts";
import { documentRetrievalPipeline } from "../utils/rag.util";
import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { shuffle } from "lodash";
import { distributeQuestions } from "../utils/tutorial.util";
import { z } from "zod";

// MARK: Question Generation
/**
 * Synthesize questions for a subtopic
 * @param searchingKeywords The searching keywords
 * @param subtopic The subtopic
 * @param subtopic_description The description
 * @param lesson_learning_outcome The learning outcomes
 * @param cognitive_level The cognitive level
 * @param learning_level The learning rate
 * @param totalNumberOfQuestions The total number of questions
 * @param questionType The type of questions to generate ('short-answer' or 'multiple_choice')
 * @returns The generated questions
 */
export async function synthesizeQuestionsForSubtopic(
  searchingKeywords: string,
  module: string,
  lesson: string,
  lesson_description: string,
  sub_lesson_id: number,
  subtopic: string,
  subtopic_description: string,
  lesson_learning_outcome: string[],
  cognitive_level: string[],
  learning_level: LearningLevel,
  totalNumberOfQuestions: number,
  questionType: "short-answer" | "mcq"
): Promise<
  {
    sub_lesson_id: number;
    question: string;
    answer: string;
    type: string;
    options: string[];
    difficulty: string;
  }[]
> {
  const isNotMcq = questionType === "short-answer";
  const prompt = isNotMcq
    ? GenerateShortAnswerQuestionPrompt
    : GenerateMultipleChoiceQuestionPrompt;

  const jsonParser = StructuredOutputParser.fromZodSchema(
    z.array(
      z.object({
        question: z.string().describe("The question to be asked"),
        answer: z.string().describe("The correct answer to the question"),
        difficulty: z
          .string()
          .describe(
            "The difficulty level of the question. The difficulty level can be 'beginner', 'intermediate', or 'advanced'"
          ),
        ...(isNotMcq
          ? {}
          : {
              distractors: z
                .array(z.string())
                .optional()
                .describe("The options for the multiple choice question"),
            }),
      })
    )
  );

  const questionGenerationPrompt = PromptTemplate.fromTemplate(prompt);

  const context = documentRetrievalPipeline(searchingKeywords, 6);

  const retrievalChain = RunnableSequence.from([
    {
      context: (input) => input.context,
      module: (input) => input.module,
      lesson: (input) => input.lesson,
      lesson_description: (input) => input.lesson_description,
      subtopic: (input) => input.subtopic,
      subtopic_description: (input) => input.subtopic_description,
      lesson_learning_outcome: (input) => input.lesson_learning_outcome,
      cognitive_level: (input) => input.cognitive_level,
      learning_level: (input) => input.learning_level,
      totalNumberOfQuestions: (input) => input.totalNumberOfQuestions,
      beginnerQuestions: (input) => input.questionDistribution.beginner,
      intermediateQuestions: (input) => input.questionDistribution.intermediate,
      advancedQuestions: (input) => input.questionDistribution.advanced,

      dynamic_taxonomy_level_definition: (input) =>
        input.dynamic_taxonomy_level_definition,
      dynamic_question_characteristics: (input) =>
        input.dynamic_question_characteristics,

      format_instructions: (input) => input.formatInstructions,
    },
    questionGenerationPrompt,
    getChatModel,
    jsonParser,
  ]);

  const questionResponse = await retrievalChain.invoke({
    context,
    module,
    lesson,
    lesson_description,
    subtopic,
    subtopic_description,
    lesson_learning_outcome,
    cognitive_level,
    learning_level,
    totalNumberOfQuestions,
    questionDistribution: distributeQuestions(
      learning_level,
      totalNumberOfQuestions
    ),
    dynamic_taxonomy_level_definition:
      dynamic_taxonomy_level_definition[learning_level],
    dynamic_question_characteristics:
      dynamic_question_characteristics[learning_level],
    formatInstructions: jsonParser.getFormatInstructions(),
  });

  const questions = questionResponse.map((question) => {
    if (isNotMcq) {
      return {
        ...question,
        sub_lesson_id,
        type: questionType,
        options: [],
      };
    }

    const answer = question.answer.replace(/\.$/, "");
    const distractors = (question.distractors as string[])?.map((option) =>
      option.replace(/\.$/, "")
    );

    const options: string[] = distractors ? [answer, ...distractors] : [];

    return {
      ...question,
      sub_lesson_id,
      type: questionType,
      answer: answer,
      options: shuffle(options),
    };
  });

  return questions;
}

//Filter out the questions that are relevant to the subtopic
// export async function filterQuestionsForSubtopic() //TODO

export async function markStudentAnswerCorrectOrIncorrect(
  lesson: string,
  subtopic: string,
  subtopic_description: string,
  questions: {
    question: string;
    studentAnswer: string;
    correctAnswer: string;
  }[]
): Promise<boolean[]> {
  const questionAsString = questions
    .map((question, index) => {
      return `
    <Question No: ${index}>

      <Question>
      ${question.question}
      </Question>

      <StudentAnswer>
       ${question.studentAnswer}
      </StudentAnswer>

      <Correct Example Answer>
      ${question.correctAnswer}
      </Correct Example Answer>

     </End of Question No: ${index}>
      `;
    })
    .join("\n");

  const jsonParser = StructuredOutputParser.fromZodSchema(z.array(z.boolean()));

  const generationPrompt = PromptTemplate.fromTemplate(
    MarkShortAnswerQuestionPrompt
  );

  const context = documentRetrievalPipeline(
    `${lesson} ${subtopic} ${subtopic_description}`,
    2
  );
  const retrievalChain = RunnableSequence.from([
    {
      context: (input) => input.context,
      lesson: (input) => input.lesson,
      subtopic: (input) => input.subtopic,
      description: (input) => input.subtopic_description,
      questions: (input) => input.questions,
      format_instructions: (input) => input.formatInstructions,
    },
    generationPrompt,
    getChatModel,
    jsonParser,
  ]);

  const questionResponse = await retrievalChain.invoke({
    context,
    lesson,
    subtopic,
    subtopic_description,
    questions: questionAsString,
    formatInstructions: jsonParser.getFormatInstructions(),
  });

  return questionResponse;
}

export async function synthesizeFeedbackForQuestions(
  lesson: string,
  subtopic: string,
  subtopic_description: string,
  questions: {
    question: string;
    studentAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    feedbackType: "basic" | "detailed";
  }[]
): Promise<string[]> {
  const questionAsString = questions
    .map((question, index) => {
      return `
      <Question>

      Question:
      <Question>
      ${question.question}
      </Question>

      Student Answer : 
      <StudentAnswer>
       ${question.studentAnswer}
      </StudentAnswer>

      Correct Answer : 
      <CorrectAnswer>
      ${question.correctAnswer}
      </CorrectAnswer>

      Is Correct : 
      <IsCorrect>
      ${question.isCorrect ? "Yes" : "No"}
      </IsCorrect>

      Requested Feedback Type :
      <FeedbackType>
      ${question.feedbackType}
      </FeedbackType>

     </Question>
     /n
      `;
    })
    .join("\n");

  const jsonParser = StructuredOutputParser.fromZodSchema(z.array(z.string()));

  const generationPrompt = PromptTemplate.fromTemplate(
    FeedbackForQuestionPrompt
  );

  const context = documentRetrievalPipeline(
    `${lesson} ${subtopic} ${subtopic_description}`,
    8
  );

  const retrievalChain = RunnableSequence.from([
    {
      context: (input) => input.context,
      lesson: (input) => input.lesson,
      subtopic: (input) => input.subtopic,
      description: (input) => input.subtopic_description,
      questions: (input) => input.questions,
      format_instructions: (input) => input.formatInstructions,
    },
    generationPrompt,
    getChatModel,
    jsonParser,
  ]);

  const questionResponse = await retrievalChain.invoke({
    context,
    lesson,
    subtopic,
    subtopic_description,
    questions: questionAsString,
    formatInstructions: jsonParser.getFormatInstructions(),
  });

  return questionResponse;
}

const dynamic_taxonomy_level_definition: {
  [K in LearningLevel]: string;
} = {
  beginner: `
1. Remembering: Recalling facts, details, or information.
2. Understanding: Comprehending meaning, explaining in own words.
`,
  intermediate: `
3. Applying: Using knowledge in new situations or to solve problems.
4. Analyzing: Breaking down information, identifying patterns and relationships.
`,
  //TODO: Improve this
  advanced: `
5. Evaluating: Making judgments, critiquing, assessing ideas or solutions.
6. Creating: Generating new ideas, concepts, or products; synthesizing information.
`,
};

const dynamic_question_characteristics: {
  [K in LearningLevel]: string;
} = {
  beginner: `Use simple language, focus on fundamental concepts. These questions will cover first two levels of Bloom's Taxonomy (Remembering, Understanding).`,
  intermediate: `Incorporate field-specific terms, require knowledge application, promote analytical thinking. Aim for medium Bloom's Taxonomy levels (Applying, Analyzing).`,
  advanced: `Use complex language, require critical thinking, promote creativity. Aim for the highest Bloom's Taxonomy levels (Evaluating, Creating).`,
};
