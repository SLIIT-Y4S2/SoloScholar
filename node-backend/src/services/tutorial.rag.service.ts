import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import {
  GenerateMultipleChoiceQuestionPrompt,
  GenerateShortAnswerQuestionPrompt,
  MarkShortAnswerQuestionPrompt,
} from "../prompt-templates/tutorial.template";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString } from "../utils/rag.util";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// MARK: Question Generation

async function documentRetrievalPipeline() {
  const pineconeIndex = await getPineconeIndex();
  const embeddingModel = getEmbeddings();
  // Get the PineconeStore object
  const pineconeStore = await PineconeStore.fromExistingIndex(embeddingModel, {
    pineconeIndex,
  });
  const retriever = pineconeStore.asRetriever(3);
  // Create a runnable sequence
  const runnableSequence = RunnableSequence.from([
    (input) => input.searchingKeywords,
    retriever,
    convertDocsToString,
  ]);
  return runnableSequence;
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
 * @param questionType The type of questions to generate ('short_answer' or 'multiple_choice')
 * @returns The generated questions
 */
export async function synthesizeQuestionsForSubtopic(
  searchingKeywords: string,
  subtopic_id: number,
  subtopic: string,
  subtopic_description: string,
  lesson_learning_outcome: string[],
  cognitive_level: string[],
  learningRate: string,
  totalNumberOfQuestions: number,
  questionType: "essay" | "mcq"
): Promise<
  {
    subtopic_id: number;
    question: string;
    answer: string;
    type: string;
    options: string[];
  }[]
> {
  const isNotMcq = questionType === "essay";
  const prompt = isNotMcq
    ? GenerateShortAnswerQuestionPrompt
    : GenerateMultipleChoiceQuestionPrompt;

  const formatInstructions = isNotMcq
    ? "Respond with a valid JSON array, containing object with two fields: 'question' and 'answer'."
    : "Respond with a valid JSON array, containing object with three fields: 'question', 'answer' and 'distractors'.";

  const parser = new JsonOutputParser<SynthesizedQuestions[]>();

  const questionGenerationPrompt = ChatPromptTemplate.fromTemplate(prompt);

  const partialedPrompt = await questionGenerationPrompt.partial({
    format_instructions: formatInstructions,
  });

  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalPipeline,
      subtopic: (input) => input.subtopic,
      description: (input) => input.subtopic_description,
      lesson_learning_outcome: (input) => input.lesson_learning_outcome,
      cognitive_level: (input) => input.cognitive_level,
      learningRate: (input) => input.learningRate,
      totalNumberOfQuestions: (input) => input.totalNumberOfQuestions,
    },
    partialedPrompt,
    getChatModel,
    new StringOutputParser(),
  ]);

  const questionResponse = await retrievalChain.pipe(parser).invoke({
    searchingKeywords,
    subtopic,
    subtopic_description,
    lesson_learning_outcome,
    cognitive_level,
    learningRate,
    totalNumberOfQuestions,
  });

  const questions = questionResponse.map((question) => {
    if (isNotMcq)
      return {
        ...question,
        subtopic_id,
        type: questionType,
        options: [],
      };
    const answer = question.answer.replace(/\.$/, "");

    const distractors = question.distractors?.map((option) =>
      option.replace(/\.$/, "")
    );

    const options: string[] = distractors
      ? [answer, ...distractors].sort(() => Math.random() - 0.5)
      : [];

    return {
      ...question,
      subtopic_id,
      type: questionType,
      answer: answer,
      options,
    };
  });

  return questions;
}

interface SynthesizedQuestions {
  question: string;
  answer: string;
  distractors?: string[];
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

  //TODO add context

  const formatInstructions =
    "Respond with a valid JSON array of boolean values.";

  const parser = new JsonOutputParser<boolean[]>();

  const generationPrompt = ChatPromptTemplate.fromTemplate(
    MarkShortAnswerQuestionPrompt
  );

  const partialedPrompt = await generationPrompt.partial({
    format_instructions: formatInstructions,
  });

  const retrievalChain = RunnableSequence.from([
    {
      context: documentRetrievalPipeline,
      lesson: (input) => input.lesson,
      subtopic: (input) => input.subtopic,
      description: (input) => input.subtopic_description,
      questions: (input) => input.questions,
    },
    partialedPrompt,
    getChatModel,
    new StringOutputParser(),
  ]);

  const questionResponse = await retrievalChain.pipe(parser).invoke({
    searchingKeywords: `${lesson} ${subtopic} ${subtopic_description}`,
    lesson,
    subtopic,
    subtopic_description,
    questions: questionAsString,
  });

  console.log(questionAsString);
  console.log(questionResponse);

  return questionResponse;
}

// markStudentAnswerCorrectOrIncorrect("adf", "adf", "adf", [
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
//   {
//     question: "What is the capital of France?",
//     studentAnswer: "Paris",
//     correctAnswer: "Paris",
//   },
// ]);
