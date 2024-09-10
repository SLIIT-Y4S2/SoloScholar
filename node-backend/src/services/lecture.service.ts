import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import {
    Lecturesectionprompt,
    LectureIntroductionPrompt,
    LectureConclusionPrompt,
    LectureMCQPrompt,
    PostAssessmentMCQPrompt,
    LearningOutcomesLecturePrompt,
    MarkdownPPTSlidePrompt,
} from "../prompt-templates/lecture.template";
import { LessonOutlineType } from "../types/lesson.types";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString } from "../utils/rag.util";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { shuffle } from "lodash";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";

import { getLearningOutcomesByLessonTitle } from '../../../node-backend/src/services/db/lecture.db.service';

// MARK: Detailed Lesson Outline
/**
 * Document retrieval pipeline
 * @param keyWords - The user query
 * @param kValue - The number of similar documents to retrieve
 * @returns A string of related context
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

// MARK: generate intro lecture
export async function generateIntroForLecture(
    lesson_title: string,
    lesson_subtopics: { topic: string; description: string }[]
) {
    const context = await documentRetrievalPipeline(
        `${lesson_title} ${lesson_subtopics
            .map((subtopic) => `${subtopic.topic} ${subtopic.description}`)
            .join(" ")}`
    );

    // Generate a introduction lecture using generated content
    const lectureIntroductionPrompt = PromptTemplate.fromTemplate(
        LectureIntroductionPrompt
    );

    // Create a runnable sequence for generating the introduction
    interface LessonPlan {
        topic: string;
        description: string;
    }

    interface IntroPipelineInput {
        context: string;
        lesson_title: string;
        lesson_plan: LessonPlan[];
    }

    const introPipeline = RunnableSequence.from<IntroPipelineInput>([
        {
            context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            lesson_plan: (input) =>
                input.lesson_plan
                    .map((subtopic) => `${subtopic.topic} ${subtopic.description}`)
                    .join("\n"),
        },
        lectureIntroductionPrompt,
        getChatModel,
        new StringOutputParser(),
    ]);

    const introTranscript = await introPipeline.invoke({
        context: context,
        lesson_title: lesson_title,
        lesson_plan: lesson_subtopics,
    });

    return introTranscript;
}

// MARK: generate section for each subtopic
export async function generateLectureForSubtopic(
    lesson_title: string,
    learning_level: string,
    subtopic: string,
    description: string,
    prevSections: string[]
) {
    const context = await documentRetrievalPipeline(`${subtopic} ${description} ${learning_level}`);

    function getLevelInfo(learning_level: string): string {
        switch (learning_level.toLowerCase()) {
            case 'beginner':
                return `
                - Use very simple language, avoiding jargon
                - Explain every new term thoroughly
                - Use abundant real-world examples and analogies
                - Include frequent summaries and checkpoints
                - Keep the content focused on foundational concepts only
                `;
            case 'intermediate':
                return `
                - Use more technical language, briefly explaining new terms
                - Dive deeper into concepts, exploring some complexities
                - Discuss practical applications and industry relevance
                - Make connections between different aspects of the topic
                - Include some challenges or thought-provoking questions
                `;
            case 'advanced':
                return `
                - Use highly technical language without explanations
                - Focus on cutting-edge concepts and current research
                - Discuss advanced applications and theoretical implications
                - Analyze complex relationships between different aspects of the topic
                - Include critical analysis and open research questions
                `;
            default:
                return `
                - Use clear and concise language, adjust explanations based on student needs
                - Provide real-world examples where applicable
                - Ensure content is adaptable to different learning levels
                `;
        }
    }
    

    // Generate content for each subtopics
    const lectureSectionPrompt = PromptTemplate.fromTemplate(Lecturesectionprompt);

    // Create a runnable sequence for generating
    const realWorldScenarioPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            learning_level: (input) => input.learning_level,
            subtopic: (input) => input.subtopic,
            description: (input) => input.description,
            lesson_title: (input) => input.lesson_title,
            levelInfo: (input) => input.levelInfo,
            prevSections: (input) => input.prevSections,
        },
        lectureSectionPrompt,
        getChatModel,
        new StringOutputParser(),
    ]);

    const levelInfo = getLevelInfo(learning_level);


    const sectionTranscript = await realWorldScenarioPipeline.invoke({
        context: context,
        subtopic: subtopic,
        description: description,
        lesson_title: lesson_title,
        learning_level: learning_level,
        levelInfo: levelInfo,
        prevSections: prevSections.join("\n"),
    });

    return sectionTranscript;
}

// MARK: generate conclusion lecture
export async function generateConclusionForLecture(
    lesson_title: string,
    generatedContent: string[]
) {
    const context = await documentRetrievalPipeline(lesson_title);

    // Generate lecture conclusion using generated content
    const lectureConclusionPrompt = PromptTemplate.fromTemplate(
        LectureConclusionPrompt
    );

    // Create a runnable sequence for generating the conclusion
    const conclusionPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            generated_content: (input) => input.generated_content.join("\n"),
        },
        lectureConclusionPrompt,
        getChatModel,
        new StringOutputParser(),
    ]);

    const conclusionTranscript = await conclusionPipeline.invoke({
        context: context,
        lesson_title: lesson_title,
        generated_content: generatedContent,
    });

    return conclusionTranscript;
}

// MARK: generate pre MCQ questions
export async function generateMCQsForLecture(
    lesson_title: string,
    generatedContent: string[],
    type: "pre" | "post"
) {
    const context = await documentRetrievalPipeline(lesson_title);


    // const formatInstructions =
    //     "Respond with a valid JSON array, containing object with four fields: 'question', 'answer' and 'distractors'. field 'distractors' should be an array of strings.";

    const jsonParser = StructuredOutputParser.fromZodSchema(
        z.array(z.object({
            question: z.string().describe("mcq question"),
            answer: z.string().describe("correct answer for the question"),
            distractors: z.array(z.string()).describe("array of distractors"),
        }))
    );
    // {
    //   question: string;
    //   answer: string;
    //   distractors: string[];
    // }[]

    // Generate MCQ questions using the related context and subtopics
    const lectureMCQPrompt = PromptTemplate.fromTemplate(
        type == "pre" ? LectureMCQPrompt : PostAssessmentMCQPrompt
    );

    // Create a runnable sequence for generating MCQs
    const mcqPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            generated_content: (input) => input.generated_content.join("\n"),
            format_instructions: (input) => input.format_instructions,
        },
        lectureMCQPrompt,
        getChatModel,
        jsonParser,
    ]);

    const mcqQuestions = await mcqPipeline.invoke({
        context: context,
        lesson_title: lesson_title,
        generated_content: generatedContent,
        format_instructions: jsonParser.getFormatInstructions(),
    });

    return mcqQuestions.map((mcq, index) => ({
        ...mcq,
        question_number: index + 1,
        type: type,
        options: shuffle([mcq.answer, ...mcq.distractors]),
    }));
}


// MARK: generate post-assessment MCQs
// export async function generatePostAssessmentMCQs(lesson_title: string, generatedContent: string[]) {
//     const context = await documentRetrievalPipeline(lesson_title);

//     // Generate post-assessment MCQ questions using the related context and main points
//     const postAssessmentMCQPrompt = PromptTemplate.fromTemplate(PostAssessmentMCQPrompt);

//     // Create a runnable sequence for generating post-assessment MCQs
//     const postAssessmentPipeline = RunnableSequence.from([
//         {
//             context: (input) => input.context,
//             lesson_title: (input) => input.lesson_title,
//             generated_content: (input) => input.generated_content.join("\n")
//         },
//         postAssessmentMCQPrompt,
//         getChatModel,
//         new StringOutputParser()
//     ]);

//     const postAssessmentQuestions = await postAssessmentPipeline.invoke({
//         context: context,
//         lesson_title: lesson_title,
//         generated_content: generatedContent
//     });

//     return postAssessmentQuestions;
// }



export async function generateLectureFromLearningOutcomes(
    lesson_title: string
): Promise<string> {
    // Fetch learning outcomes related to the lesson
    const learningOutcomes = await getLearningOutcomesByLessonTitle(lesson_title);

    // Get related context
    // const context = await documentRetrievalPipeline(`${lesson_title} ${learningOutcomes}`);

    // Create the prompt template
    const learningOutcomesLecturePrompt = PromptTemplate.fromTemplate(LearningOutcomesLecturePrompt);

    // Create a runnable sequence for generating the lecture section
    const lecturePipeline = RunnableSequence.from([
        {
            //context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            learning_outcomes: (input) => input.learning_outcomes,
        },
        learningOutcomesLecturePrompt,
        getChatModel,
        new StringOutputParser(),
    ]);

    // Generate the lecture section
    const lOlectureSection = await lecturePipeline.invoke({
        //context: context,
        lesson_title: lesson_title,
        learning_outcomes: learningOutcomes,
    });

    return lOlectureSection;
}


// Function to generate markdown PPT slides from content
export async function generateMarkdownPPTSlidesFromContent(
    lesson_title: string,
    content: string
) {
    const markdownPPTPipeline = RunnableSequence.from([
        {
            lesson_title: (input) => input.lesson_title,
            content: (input) => input.content,
        },
        PromptTemplate.fromTemplate(MarkdownPPTSlidePrompt),
        getChatModel,
        new StringOutputParser(),
    ]);

    // Generate the markdown slides
    let markdownSlides = await markdownPPTPipeline.invoke({
        lesson_title: lesson_title,
        content: content,
    });

    // Clean up excessive newlines (you may also adjust spacing between headers and paragraphs)
    markdownSlides = markdownSlides
        .replace(/\\n/g, '\n')            // Replace literal "\n" with real newlines
        .replace(/\n{3,}/g, '\n\n')       // Limit multiple newlines to two
        .replace(/---\n\n/g, '---\n')     // Remove extra line breaks after dividers (if any)
        .replace(/\n\s*\n/g, '\n\n');     // Ensure there is exactly one blank line between paragraphs

    return markdownSlides;
}


