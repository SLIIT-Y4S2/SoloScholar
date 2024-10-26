import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { getChatModel, highLevelChatModel } from "../utils/openai.util";
import {
    AnswerEvaluationPrompt,
    HintGenerationPrompt,
    LabTaskEvaluationPrompt,
    QuestionGenerationPrompt,
    RealWorldScenarioPrompt,
    SupportingMaterialGenerationPrompt,
} from "../prompt-templates/lab.prompts";
import {
    StringOutputParser,
    StructuredOutputParser,
} from "@langchain/core/output_parsers";
import {
    zodSchemaForHintGeneration,
    zodSchemaForLabSheetFeedback,
    zodSchemaForQuestions,
    zodSchemaForRealWorldScenario,
    zodSchemaForStudentAnswerEvaluation,
    zodSchemaForSupportingMaterial,
} from "../utils/zodSchema.util";
import { documentRetrievalPipeline } from "../utils/rag.util";
import { OutputFixingParser } from "langchain/output_parsers";
import { logger } from "../utils/logger.utils";
import { z } from "zod";
import { LearningOutcome } from "../types/module.types";

//MARK: Custom Types
interface ResponseSynthesizerForLabsInputType {
    lessonTitle: string;
    learningLevel: string;
    lessonOutline: string;
    learningOutcomes: LearningOutcome[];
}

interface ResponseSynthesizerForLabsOutputType {
    realWorldScenario: string;
    supportingMaterial: z.infer<typeof zodSchemaForSupportingMaterial>;
    questions: z.infer<typeof zodSchemaForQuestions>;
}

interface StudentAnswerEvaluationInputType {
    topicOfTheLab: string;
    realWorldScenario: string;
    supportingMaterial: z.infer<typeof zodSchemaForSupportingMaterial>;
    question: string;
    studentAnswer: string;
    previousQuestionsAndAnswers: {
        question: string;
        answer: string;
    }[];
}

interface StudentAnswerEvaluationOutputType {
    studentAnswerEvaluation: z.infer<typeof zodSchemaForStudentAnswerEvaluation>;
}

interface HintGenerationInputType {
    realWorldScenario: string;
    supportingMaterial: any;
    question: string;
    previousAnswers: string[];
}

interface HintGenerationOutputType {
    hint: string;
}
interface FeedbackGenerationInputType {
    topicOfTheLab: string;
    realWorldScenario: string;
    supportingMaterial: any;
    questions: {
        question: string;
        studentAnswer: string[];
        reflection: string;
    }[];
}

//MARK: Response Synthesizer for Labs
/**
 *
 * @param lessonTitle
 * @param learningLevel
 * @param lessonOutline
 * @param learningOutcomes
 * @returns
 */
export async function responseSynthesizerForLabs({
    lessonTitle,
    learningLevel,
    lessonOutline,
    learningOutcomes,
}: ResponseSynthesizerForLabsInputType): Promise<ResponseSynthesizerForLabsOutputType> {
    // Retrieve related context to the keywords from the vector database
    const relatedContext = await documentRetrievalPipeline(
        `${lessonTitle} ${learningOutcomes} ${lessonOutline}`,
        10
    );

    //MARK: Real World Scenario Generation

    // Generate a real-world scenario for the lab activity using the related context and subtopics
    const realWorldScenarioPrompt = PromptTemplate.fromTemplate(
        RealWorldScenarioPrompt
    );

    const outputParserForRealWorldScenario = StructuredOutputParser.fromZodSchema(
        zodSchemaForRealWorldScenario
    );

    // Runnable sequence for generating a real-world scenario
    const realWorldScenarioPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            detailedOutline: (input) => input.detailedOutline,
            topicOfTheLab: (input) => input.topicOfTheLab,
            formatInstructions: (input) => input.formatInstructions,
        },
        realWorldScenarioPrompt,
        () => highLevelChatModel(),
        new StringOutputParser(),
    ]);

    const realWorldScenario = await realWorldScenarioPipeline.invoke({
        relatedContext: relatedContext,
        learningOutcomes: learningOutcomes,
        detailedOutline: lessonOutline,
        topicOfTheLab: lessonTitle,
        formatInstructions:
            outputParserForRealWorldScenario.getFormatInstructions(),
    });

    //MARK: Supporting Material Generation

    // Generate supporting materials for the lab activity using the real-world scenario
    const supportingMaterialPrompt = PromptTemplate.fromTemplate(
        SupportingMaterialGenerationPrompt
    );

    // Define the output parser for the supporting material prompt using Zod
    const outputParserForSupportingMaterial =
        StructuredOutputParser.fromZodSchema(zodSchemaForSupportingMaterial);

    // Fixing parser for the supporting material
    const fixingParserForSupportingMaterial = OutputFixingParser.fromLLM(
        highLevelChatModel(),
        outputParserForSupportingMaterial
    );

    // Runnable sequence for generating supporting materials
    const supportingMaterialPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            topicOfTheLab: (input) => input.topicOfTheLab,
            detailedOutline: (input) => input.detailedOutline,
            realWorldScenario: (input) => input.realWorldScenario,
            formatInstructions: (input) => input.formatInstructions,
        },
        supportingMaterialPrompt,
        () => highLevelChatModel(),
        fixingParserForSupportingMaterial,
    ]);

    const supportingMaterial = await supportingMaterialPipeline.invoke({
        relatedContext: relatedContext,
        learningOutcomes: learningOutcomes,
        topicOfTheLab: lessonTitle,
        detailedOutline: lessonOutline,
        realWorldScenario: realWorldScenario,
        formatInstructions:
            outputParserForSupportingMaterial.getFormatInstructions(),
    });

    // Define question generation prompt
    const questionGenerationPrompt = PromptTemplate.fromTemplate(
        QuestionGenerationPrompt
    );

    const outputParserForQuestions = StructuredOutputParser.fromZodSchema(
        zodSchemaForQuestions
    );

    // Fixing parser for the questions
    const fixingParserForQuestions = OutputFixingParser.fromLLM(
        highLevelChatModel(),
        outputParserForQuestions
    );

    // MARK:Function to distribute questions based on learning level
    function distributeQuestions(
        totalQuestions: number,
        learningLevel: string
    ): {
        beginnerQuestions: number;
        intermediateQuestions: number;
        advancedQuestions: number;
    } {
        // Define base distribution ratios based on learning level
        const ratios = {
            beginner: { Beginner: 0.5, Intermediate: 0.3, Advanced: 0.2 },
            intermediate: { Beginner: 0.3, Intermediate: 0.4, Advanced: 0.3 },
            advanced: { Beginner: 0.2, Intermediate: 0.3, Advanced: 0.5 },
        };

        // Get the ratio for the specified learning level
        const levelRatios = ratios[learningLevel as keyof typeof ratios];

        // Initial distribution calculation (rounded)
        let beginnerQuestions = Math.round(totalQuestions * levelRatios.Beginner);
        let intermediateQuestions = Math.round(
            totalQuestions * levelRatios.Intermediate
        );
        let advancedQuestions = Math.round(totalQuestions * levelRatios.Advanced);

        // Adjust total if rounding causes discrepancy
        let questionSum =
            beginnerQuestions + intermediateQuestions + advancedQuestions;
        let difference = totalQuestions - questionSum;

        // Balance total by adjusting the highest target level category first
        learningLevel = learningLevel.toLowerCase();
        if (difference > 0) {
            if (learningLevel === "beginner") {
                beginnerQuestions += difference;
            } else if (learningLevel === "intermediate") {
                intermediateQuestions += difference;
            } else {
                advancedQuestions += difference;
            }
        } else if (difference < 0) {
            if (learningLevel === "advanced" && advancedQuestions > 0) {
                advancedQuestions += difference;
            } else if (
                learningLevel === "intermediate" &&
                intermediateQuestions > 0
            ) {
                intermediateQuestions += difference;
            } else {
                beginnerQuestions += difference;
            }
        }

        return {
            beginnerQuestions,
            intermediateQuestions,
            advancedQuestions,
        };
    }

    const totalQuestions = 10;
    const { beginnerQuestions, intermediateQuestions, advancedQuestions } =
        distributeQuestions(totalQuestions, learningLevel);
    // Create a runnable sequence for generating questions
    const questionGenerationPipeline = RunnableSequence.from([
        {
            learningOutcomes: (input) => input.learningOutcomes,
            topicOfTheLab: (input) => input.topicOfTheLab,
            detailedOutline: (input) => input.detailedOutline,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial,
            learningLevel: (input) => input.learningLevel,
            beginnerQuestions: (input) => input.beginnerQuestions,
            intermediateQuestions: (input) => input.intermediateQuestions,
            advancedQuestions: (input) => input.advancedQuestions,
            formatInstructions: (input) => input.formatInstructions,
        },
        questionGenerationPrompt,
        highLevelChatModel,
        fixingParserForQuestions,
    ]);

    try {
        const questions = await questionGenerationPipeline.invoke({
            learningOutcomes: learningOutcomes,
            topicOfTheLab: lessonTitle,
            detailedOutline: lessonOutline,
            realWorldScenario: realWorldScenario,
            supportingMaterial: supportingMaterial,
            learningLevel: learningLevel,
            beginnerQuestions: beginnerQuestions,
            intermediateQuestions: intermediateQuestions,
            advancedQuestions: advancedQuestions,
            formatInstructions: outputParserForQuestions.getFormatInstructions(),
        });

        return {
            realWorldScenario,
            supportingMaterial,
            questions,
        };
    } catch (error) {
        logger.error(error);
        throw new Error("Failed to generate lab sheet");
    }
}

// MARK: Student Answer Evaluation
/**
 * @param topicOfTheLab The topic of the lab
 * @param realWorldScenario The real-world scenario for the lab activity
 * @param supportingMaterial The supporting materials for the lab activity
 * @param learningOutcomes The learning outcomes associated with the lab activity
 * @param question The question to evaluate the student's answer
 */
export async function evaluateStudentAnswers({
    topicOfTheLab,
    realWorldScenario,
    supportingMaterial,
    previousQuestionsAndAnswers,
    question,
    studentAnswer,
}: StudentAnswerEvaluationInputType): Promise<StudentAnswerEvaluationOutputType> {
    const studentAnswerEvaluationPrompt = PromptTemplate.fromTemplate(
        AnswerEvaluationPrompt
    );

    const outputParserForAnswers = StructuredOutputParser.fromZodSchema(
        zodSchemaForStudentAnswerEvaluation
    );

    const fixingParserForAnswers = OutputFixingParser.fromLLM(
        getChatModel(),
        outputParserForAnswers
    );

    const studentAnswerEvaluationPipeline = RunnableSequence.from([
        {
            topicOfTheLab: (input) => input.topicOfTheLab,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial,
            previousQuestionsAndAnswers: (input) => input.previousQuestionsAndAnswers,
            question: (input) => input.question,
            studentAnswer: (input) => input.studentAnswer,
            formatInstructions: (input) => input.formatInstructions,
        },
        studentAnswerEvaluationPrompt,
        highLevelChatModel,
        fixingParserForAnswers,
    ]);

    const studentAnswerEvaluation = await studentAnswerEvaluationPipeline.invoke({
        topicOfTheLab: topicOfTheLab,
        realWorldScenario: realWorldScenario,
        supportingMaterial: supportingMaterial,
        previousQuestionsAndAnswers: previousQuestionsAndAnswers,
        question: question,
        studentAnswer: studentAnswer,
        formatInstructions: outputParserForAnswers.getFormatInstructions(),
    });

    return {
        studentAnswerEvaluation,
    };
}

// MARK: Hint Generation
/**
 *
 * @param previousAnswers - The previous answers provided by the student
 * @param realWorldScenario - The real-world scenario for the lab activity
 * @param question - The question to generate hints for
 * @param supportingMaterial - The supporting materials for the lab activity
 * @param topicOfTheLab - The topic of the lab
 * @returns {Promise<HintGenerationOutputType>} - The generated hint
 */
export async function generateHintsForStudentAnswers({
    previousAnswers,
    realWorldScenario,
    question,
    supportingMaterial,
}: HintGenerationInputType): Promise<HintGenerationOutputType> {
    const hintGenerationPrompt =
        PromptTemplate.fromTemplate(HintGenerationPrompt);

    const outputParserForHints = StructuredOutputParser.fromZodSchema(
        zodSchemaForHintGeneration
    );

    const fixingParserForHints = OutputFixingParser.fromLLM(
        getChatModel(),
        outputParserForHints
    );

    const hintGenerationPipeline = RunnableSequence.from([
        {
            previousAnswers: (input) => input.previousAnswers,
            realWorldScenario: (input) => input.realWorldScenario,
            question: (input) => input.question,
            supportingMaterial: (input) => input.supportingMaterial,
            formatInstructions: (input) => input.formatInstructions,
        },
        hintGenerationPrompt,
        getChatModel,
        fixingParserForHints,
    ]);

    const hint = await hintGenerationPipeline.invoke({
        previousAnswers: previousAnswers,
        realWorldScenario: realWorldScenario,
        question: question,
        supportingMaterial: supportingMaterial,
        formatInstructions: outputParserForHints.getFormatInstructions(),
    });

    return hint;
}

// MARK: Feedback Generation
/**
 *
 * @param realWorldScenario - The real-world scenario for the lab activity
 * @param supportingMaterial - The supporting materials for the lab activity
 * @param questions - The questions for the lab activity
 * @returns {Promise<z.infer<typeof zodSchemaForLabSheetFeedback>>} - The feedback for the lab activity
 */
export async function generateFeedbackForLabActivity({
    topicOfTheLab,
    realWorldScenario,
    supportingMaterial,
    questions,
}: FeedbackGenerationInputType) {
    const feedbackGenerationPrompt = PromptTemplate.fromTemplate(
        LabTaskEvaluationPrompt
    );

    const outputParserForFeedback = StructuredOutputParser.fromZodSchema(
        zodSchemaForLabSheetFeedback
    );

    const fixingParserForFeedback = OutputFixingParser.fromLLM(
        getChatModel(),
        outputParserForFeedback
    );

    const feedbackGenerationPipeline = RunnableSequence.from([
        {
            topicOfTheLab: (input) => input.topicOfTheLab,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial,
            questionsNAnswersNReflections: (input) =>
                input.questionsNAnswersNReflections,
            formatInstructions: (input) => input.formatInstructions,
        },
        feedbackGenerationPrompt,
        highLevelChatModel,
        fixingParserForFeedback,
    ]);

    const feedback = await feedbackGenerationPipeline.invoke({
        topicOfTheLab: topicOfTheLab,
        realWorldScenario: realWorldScenario,
        supportingMaterial: supportingMaterial,
        questionsNAnswersNReflections: questions.map((question) => {
            return `
                <QuestionNAnswersNReflection>
                    <Question>${question.question}</Question>
                    <StudentAnswers>
                        ${question.studentAnswer
                    .map((answer) => `<Answer>${answer}</Answer>`)
                    .join("")}
                    </StudentAnswers>
                    <StudentReflection>${question.reflection
                }</StudentReflection>
                </QuestionNAnswersNReflection>

                `;
        }),
        formatInstructions: outputParserForFeedback.getFormatInstructions(),
    });

    return feedback;
}
