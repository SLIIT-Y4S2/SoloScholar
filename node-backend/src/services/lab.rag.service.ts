import { RunnableSequence } from "@langchain/core/runnables";
import { PromptTemplate } from "@langchain/core/prompts";
import { getChatModel } from "../utils/openai.util";
import { QuestionGenerationPrompt, RealWorldScenarioPrompt, SupportingMaterialGenerationPrompt } from "../prompt-templates/lab.prompts";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { zodSchemaForQuestions, zodSchemaForRealWorldScenario, zodSchemaForSupportingMaterial } from "../utils/zodSchema.util";
import { documentRetrievalPipeline } from "../utils/rag.util";
import { OutputFixingParser } from "langchain/output_parsers";
import { BaseOutputParser } from "@langchain/core/output_parsers";
import { logger } from "../utils/logger.utils";


function fixingParser(outputParser: BaseOutputParser) {
    const parser = OutputFixingParser.fromLLM(
        getChatModel(),
        outputParser
    );
    return parser;
}

/**
 * This function is responsible for generating a practical lab activities.
 * @param topic - The topic of the lab 
 * @returns 
 */
async function responseSynthesizerForLabs(
    lessonTitle: string,
    learningLevel: string,
    lessonOutline: string,
    learningOutcomes: string,
) {
    // Retrieve related context to the keywords from the vector database
    const relatedContext = await documentRetrievalPipeline(`${lessonTitle} ${learningOutcomes} ${lessonOutline}`, 10);

    // Generate a real-world scenario for the lab activity using the related context and subtopics
    const realWorldScenarioPrompt = PromptTemplate.fromTemplate(RealWorldScenarioPrompt);

    const outputParserForRealWorldScenario = StructuredOutputParser.fromZodSchema(zodSchemaForRealWorldScenario);

    // Create a runnable sequence for generating a real-world scenario
    const realWorldScenarioPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            detailedOutline: (input) => input.detailedOutline,
            topicOfTheLab: (input) => input.topicOfTheLab,
            formatInstructions: (input) => input.formatInstructions
        },
        realWorldScenarioPrompt,
        getChatModel,
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

    // Create a runnable sequence for generating supporting materials
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
        getChatModel,
        () => fixingParser(outputParserForSupportingMaterial),
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

    // Create a runnable sequence for generating questions
    const questionGenerationPipeline = RunnableSequence.from([
        {
            context: (input) => input.relatedContext,
            learningOutcomes: (input) => input.learningOutcomes,
            topicOfTheLab: (input) => input.topicOfTheLab,
            detailedOutline: (input) => input.detailedOutline,
            realWorldScenario: (input) => input.realWorldScenario,
            supportingMaterial: (input) => input.supportingMaterial,
            formatInstructions: (input) => input.formatInstructions
        },
        questionGenerationPrompt,
        getChatModel,
        () => fixingParser(outputParserForQuestions),
    ]);

    try {
        const questions = await questionGenerationPipeline.invoke({
            relatedContext: relatedContext,
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

async function studentAnswerEvaluation() {

}


export { documentRetrievalPipeline, responseSynthesizerForLabs, studentAnswerEvaluation };
