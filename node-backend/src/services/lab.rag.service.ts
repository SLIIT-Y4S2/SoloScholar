import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { getChatModel } from "../utils/openai.util";
import { AnswerEvaluationPrompt, HintGenerationPrompt, QuestionGenerationPrompt, RealWorldScenarioPrompt, SupportingMaterialGenerationPrompt } from "../prompt-templates/lab.prompts";
import { StringOutputParser, StructuredOutputParser, JsonOutputParser } from "@langchain/core/output_parsers";
import { zodSchemaForQuestions, zodSchemaForRealWorldScenario, zodSchemaForStudentAnswerEvaluation, zodSchemaForSupportingMaterial } from "../utils/zodSchema.util";
import { documentRetrievalPipeline } from "../utils/rag.util";
import { OutputFixingParser } from "langchain/output_parsers";
import { logger } from "../utils/logger.utils";
import { z } from "zod";
import { LearningOutcome } from "../types/module.types";

interface ResponseSynthesizerForLabsInputType {
    lessonTitle: string,
    learningLevel: string,
    lessonOutline: string,
    learningOutcomes: LearningOutcome[],
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

/**
 * 
 * @param lessonTitle 
 * @param learningLevel 
 * @param lessonOutline 
 * @param learningOutcomes 
 * @returns 
 */
export async function responseSynthesizerForLabs({ lessonTitle, learningLevel, lessonOutline, learningOutcomes }: ResponseSynthesizerForLabsInputType): Promise<ResponseSynthesizerForLabsOutputType> {
    // Retrieve related context to the keywords from the vector database
    const relatedContext = await documentRetrievalPipeline(`${lessonTitle} ${learningOutcomes} ${lessonOutline}`, 10);

    // Generate a real-world scenario for the lab activity using the related context and subtopics
    const realWorldScenarioPrompt = PromptTemplate.fromTemplate(RealWorldScenarioPrompt);

    const outputParserForRealWorldScenario = StructuredOutputParser.fromZodSchema(zodSchemaForRealWorldScenario);

    // Runnable sequence for generating a real-world scenario
    const realWorldScenarioPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            detailedOutline: (input) => input.detailedOutline,
            topicOfTheLab: (input) => input.topicOfTheLab,
            formatInstructions: (input) => input.formatInstructions
        },
        realWorldScenarioPrompt,
        () => getChatModel({ model: "gpt-4o" }),
        new StringOutputParser()
    ]);

    const realWorldScenario = await realWorldScenarioPipeline.invoke({
        relatedContext: relatedContext,
        learningOutcomes: learningOutcomes,
        detailedOutline: lessonOutline,
        topicOfTheLab: lessonTitle,
        formatInstructions: outputParserForRealWorldScenario.getFormatInstructions()
    });

    // Generate supporting materials for the lab activity using the real-world scenario
    const supportingMaterialPrompt = PromptTemplate.fromTemplate(SupportingMaterialGenerationPrompt);

    // Define the output parser for the supporting material prompt using Zod
    const outputParserForSupportingMaterial = StructuredOutputParser.fromZodSchema(zodSchemaForSupportingMaterial);

    // Fixing parser for the supporting material
    const fixingParserForSupportingMaterial = OutputFixingParser.fromLLM(
        getChatModel({ model: "gpt-4o" }),
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
            formatInstructions: (input) => input.formatInstructions
        },
        supportingMaterialPrompt,
        () => getChatModel({ model: "gpt-4o" }),
        fixingParserForSupportingMaterial,
    ]);

    const supportingMaterial = await supportingMaterialPipeline.invoke({
        relatedContext: relatedContext,
        learningOutcomes: learningOutcomes,
        topicOfTheLab: lessonTitle,
        detailedOutline: lessonOutline,
        realWorldScenario: realWorldScenario,
        formatInstructions: outputParserForSupportingMaterial.getFormatInstructions()
    });

    // Define question generation prompt
    const questionGenerationPrompt = PromptTemplate.fromTemplate(QuestionGenerationPrompt);

    const outputParserForQuestions = StructuredOutputParser.fromZodSchema(zodSchemaForQuestions);

    // Fixing parser for the questions
    const fixingParserForQuestions = OutputFixingParser.fromLLM(
        getChatModel(),
        outputParserForQuestions
    );

    // Create a runnable sequence for generating questions
    const questionGenerationPipeline = RunnableSequence.from([
        {
            learningOutcomes: (input) => input.learningOutcomes,
            topicOfTheLab: (input) => input.topicOfTheLab,
            detailedOutline: (input) => input.detailedOutline,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial,
            formatInstructions: (input) => input.formatInstructions
        },
        questionGenerationPrompt,
        () => getChatModel({ model: "gpt-4o" }),
        fixingParserForQuestions,
    ]);

    try {
        const questions = await questionGenerationPipeline.invoke({
            learningOutcomes: learningOutcomes,
            topicOfTheLab: lessonTitle,
            detailedOutline: lessonOutline,
            realWorldScenario: realWorldScenario,
            supportingMaterial: supportingMaterial,
            formatInstructions: outputParserForQuestions.getFormatInstructions()
        });

        return {
            realWorldScenario,
            supportingMaterial,
            questions
        };
    }
    catch (error) {
        logger.error(error);
        throw new Error("Failed to generate lab sheet");
    }
}

/**
 * @param topicOfTheLab The topic of the lab
 * @param realWorldScenario The real-world scenario for the lab activity
 * @param supportingMaterial The supporting materials for the lab activity
 * @param learningOutcomes The learning outcomes associated with the lab activity
 * @param question The question to evaluate the student's answer
*/
export async function evaluateStudentAnswers({ topicOfTheLab, realWorldScenario, supportingMaterial, question, studentAnswer }: StudentAnswerEvaluationInputType): Promise<StudentAnswerEvaluationOutputType> {
    const studentAnswerEvaluationPrompt = PromptTemplate.fromTemplate(AnswerEvaluationPrompt);

    const outputParserForAnswers = StructuredOutputParser.fromZodSchema(zodSchemaForStudentAnswerEvaluation);

    const fixingParserForAnswers = OutputFixingParser.fromLLM(
        getChatModel(),
        outputParserForAnswers
    );

    const studentAnswerEvaluationPipeline = RunnableSequence.from([
        {
            topicOfTheLab: (input) => input.topicOfTheLab,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial,
            question: (input) => input.question,
            studentAnswer: (input) => input.studentAnswer,
            formatInstructions: (input) => input.formatInstructions
        },
        studentAnswerEvaluationPrompt,
        getChatModel,
        fixingParserForAnswers,
    ]);

    const studentAnswerEvaluation = await studentAnswerEvaluationPipeline.invoke({
        topicOfTheLab: topicOfTheLab,
        realWorldScenario: realWorldScenario,
        supportingMaterial: supportingMaterial,
        question: question,
        studentAnswer: studentAnswer,
        formatInstructions: outputParserForAnswers.getFormatInstructions()
    });

    return {
        studentAnswerEvaluation
    };
}

/**
 * 
 * @param previousAnswers - The previous answers provided by the student
 * @param realWorldScenario - The real-world scenario for the lab activity
 * @param question - The question to generate hints for
 * @param supportingMaterial - The supporting materials for the lab activity
 * @param topicOfTheLab - The topic of the lab
 * @returns {Promise<HintGenerationOutputType>} - The generated hint
 */
export async function generateHintsForStudentAnswers({ previousAnswers, realWorldScenario, question, supportingMaterial }: HintGenerationInputType): Promise<HintGenerationOutputType> {
    const hintGenerationPrompt = PromptTemplate.fromTemplate(HintGenerationPrompt);

    const hintGenerationPipeline = RunnableSequence.from([
        {
            previousAnswers: (input) => input.previousAnswers,
            realWorldScenario: (input) => input.realWorldScenario,
            question: (input) => input.question,
            supportingMaterial: (input) => input.supportingMaterial,
            formatInstructions: (input) => input.formatInstructions
        },
        hintGenerationPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const hints = await hintGenerationPipeline.invoke(
        {
            previousAnswers: previousAnswers,
            realWorldScenario: realWorldScenario,
            question: question,
            supportingMaterial: supportingMaterial,
            formatInstructions: "Provide the hint in string format. Just string will be enough no need to provide 'Hint:'" 
        }
    );

    return {
        hint: hints
    };
}




