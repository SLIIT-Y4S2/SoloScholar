import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import {
  GenerateMultipleChoiceQuestionPrompt,
  GenerateShortAnswerQuestionPrompt,
  MarkShortAnswerQuestionPrompt,
  FeedbackForQuestionPrompt,
} from "../prompt-templates/tutorial.prompts";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString } from "../utils/rag.util";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { LearningLevel } from "../types/learning-material.types";
import { shuffle } from "lodash";
import { distributeQuestions } from "../utils/tutorial.util";

// MARK: Question Generation

/**
 * TODO: remove this
 * The prompt template for generating a detailed lesson outline
 * @returns A PineconeStore object
 */
async function documentRetrievalPipeline(
  keyWords: string,
  kValue: number = 10
) {
  const pineconeIndex = await getPineconeIndex();
  const embeddingModel = getEmbeddings();

  // Get the PineconeStore object
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex,
  });

  // Fetch the top 10 similar documents.
  const retriever = pineconeStore.asRetriever(kValue);

  // Create a runnable sequence
  const runnableSequence = RunnableSequence.from([
    (input) => input.keyWords,
    retriever,
    convertDocsToString,
  ]);

  const relatedContext = await runnableSequence.invoke({ keyWords: keyWords });

  return relatedContext;
}

/**
 * Synthesize questions for a subtopic
 * @param searchingKeywords The searching keywords
 * @param subtopic The subtopic
 * @param subtopic_description The description
 * @param lesson_learning_outcome The learning outcomes
 * @param cognitive_level The cognitive level
 * @param learningRate The learning rate
 * @param totalNumberOfQuestions The total number of questions
 * @param questionType The type of questions to generate ('short-answer' or 'multiple_choice')
 * @returns The generated questions
 */
export async function synthesizeQuestionsForSubtopic(
  searchingKeywords: string,
  module: string,
  lesson: string,
  sub_lesson_id: number,
  subtopic: string,
  subtopic_description: string,
  lesson_learning_outcome: string[],
  cognitive_level: string[],
  learningRate: LearningLevel,
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

  const formatInstructions = isNotMcq
    ? "Respond with a valid JSON array, containing object with three fields: 'question', 'answer', and 'difficulty'."
    : "Respond with a valid JSON array, containing object with four fields: 'question', 'answer', 'distractors', and 'difficulty'.";

  const jsonParser = new JsonOutputParser<SynthesizedQuestions[]>();

  const questionGenerationPrompt = PromptTemplate.fromTemplate(prompt);

  const promptWithFormattingInstructions =
    await questionGenerationPrompt.partial({
      format_instructions: formatInstructions,
    });

  const context = documentRetrievalPipeline(searchingKeywords, 3);

  const retrievalChain = RunnableSequence.from([
    {
      context: (input) => input.context,
      module: (input) => input.module,
      lesson: (input) => input.lesson,
      subtopic: (input) => input.subtopic,
      description: (input) => input.subtopic_description,
      lesson_learning_outcome: (input) => input.lesson_learning_outcome,
      cognitive_level: (input) => input.cognitive_level,
      learningRate: (input) => input.learningRate,
      totalNumberOfQuestions: (input) => input.totalNumberOfQuestions,
      beginnerQuestions: (input) => input.questionDistribution.beginner,
      intermediateQuestions: (input) => input.questionDistribution.intermediate,
      advancedQuestions: (input) => input.questionDistribution.advanced,
    },
    promptWithFormattingInstructions,
    getChatModel,
    jsonParser,
  ]);

  const questionResponse = await retrievalChain.invoke({
    context,
    module,
    lesson,
    subtopic,
    subtopic_description,
    lesson_learning_outcome,
    cognitive_level,
    learningRate,
    totalNumberOfQuestions,
    questionDistribution: distributeQuestions(
      learningRate,
      totalNumberOfQuestions
    ),
  });

  const questions = questionResponse.map((question) => {
    if (isNotMcq)
      return {
        ...question,
        sub_lesson_id,
        type: questionType,
        options: [],
      };
    const answer = question.answer.replace(/\.$/, "");

    const distractors = question.distractors?.map((option) =>
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

interface SynthesizedQuestions {
  question: string;
  answer: string;
  distractors?: string[];
  difficulty: string;
}

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

     </Question No: ${index}>
      `;
    })
    .join("\n");

  const formatInstructions =
    "Respond with a valid JSON array of boolean values.";

  const jsonParser = new JsonOutputParser<boolean[]>();

  const generationPrompt = PromptTemplate.fromTemplate(
    MarkShortAnswerQuestionPrompt
  );

  const partialedPrompt = await generationPrompt.partial({
    format_instructions: formatInstructions,
  });

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
    },
    partialedPrompt,
    getChatModel,
    jsonParser,
  ]);

  const questionResponse = await retrievalChain.invoke({
    context,
    lesson,
    subtopic,
    subtopic_description,
    questions: questionAsString,
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

  const formatInstructions = "Respond with a valid JSON array of strings.";

  const jsonParser = new JsonOutputParser<string[]>();

  const generationPrompt = PromptTemplate.fromTemplate(
    FeedbackForQuestionPrompt
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
    formatInstructions,
  });

  return questionResponse;
}
