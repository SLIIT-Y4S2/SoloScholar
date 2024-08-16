import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { getChatModel, getEmbeddings } from "../utils/openai.util";
import { Lecturesectionprompt, LectureIntroductionPrompt, LectureConclusionPrompt, LectureMCQPrompt, PostAssessmentMCQPrompt } from "../prompt-templates/lecture.template";
import { LessonOutlineType } from "../types/lesson.types";
import { PineconeStore } from "@langchain/pinecone";
import { getPineconeIndex } from "../utils/pinecone.util";
import { convertDocsToString } from "../utils/rag.util";
import { PromptTemplate } from "@langchain/core/prompts";
import { JsonOutputParser } from "@langchain/core/output_parsers";

// MARK: Detailed Lesson Outline
/**
 * Document retrieval pipeline
 * @param keyWords - The user query
 * @param kValue - The number of similar documents to retrieve
 * @returns A string of related context
 */
async function documentRetrievalPipeline(keyWords: string, kValue: number = 10) {
    const pineconeIndex = await getPineconeIndex();
    const embeddingModel = getEmbeddings();

    // Get the PineconeStore object
    const pineconeStore = await PineconeStore.fromExistingIndex(
        embeddingModel,
        { pineconeIndex, },
    );

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
export async function generateIntroForLecture(lesson_title: string, lesson_subtopics: { topic: string; description: string; }[]) {
    const context = await documentRetrievalPipeline(`${lesson_title} ${lesson_subtopics.map(subtopic => `${subtopic.topic} ${subtopic.description}`).join(" ")}`);

    // Generate a introduction lecture using generated content
    const lectureIntroductionPrompt = PromptTemplate.fromTemplate(LectureIntroductionPrompt);

    // Create a runnable sequence for generating the introduction
    const introPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            lesson_plan: (input) => input.lesson_plan.map(subtopic => `${subtopic.topic} ${subtopic.description}`).join("\n")
        },
        lectureIntroductionPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const introTranscript = await introPipeline.invoke({
        context: context,
        lesson_title: lesson_title,
        lesson_plan: lesson_subtopics
    });

    return introTranscript;
}

// MARK: generate section for each subtopic
export async function generateLectureForSubtopic(lesson_title: string, subtopic: string, description: string, prevSections: string[]) {
    const context = await documentRetrievalPipeline(`${subtopic} ${description}`);

    // Generate content for each subtopics
    const lectureSectionPrompt = PromptTemplate.fromTemplate(Lecturesectionprompt);

    // Create a runnable sequence for generating
    const realWorldScenarioPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            subtopic: (input) => input.subtopic,
            description: (input) => input.description,
            lesson_title: (input) => input.lesson_title,
            prevSections: (input) => input.prevSections
        },
        lectureSectionPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const sectionTranscript = await realWorldScenarioPipeline.invoke({
        context: context,
        subtopic: subtopic,
        description: description,
        lesson_title: lesson_title,
        prevSections: prevSections.join("\n")
    });

    return sectionTranscript;
}

// MARK: generate conclusion lecture
export async function generateConclusionForLecture(lesson_title: string, generatedContent: string[]) {
    const context = await documentRetrievalPipeline(lesson_title);

    // Generate lecture conclusion using generated content
    const lectureConclusionPrompt = PromptTemplate.fromTemplate(LectureConclusionPrompt);

    // Create a runnable sequence for generating the conclusion
    const conclusionPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            generated_content: (input) => input.generated_content.join("\n")
        },
        lectureConclusionPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const conclusionTranscript = await conclusionPipeline.invoke({
        context: context,
        lesson_title: lesson_title,
        generated_content: generatedContent
    });

    return conclusionTranscript;
}

// MARK: generate pre MCQ questions
export async function generateMCQsForLecture(lesson_title: string, generatedContent: string[]) {
    const context = await documentRetrievalPipeline(lesson_title);

    const formatInstructions = "Respond with a valid JSON array, containing object with four fields: 'question', 'answer' and 'distractors'. field 'distractors' should be an array of strings.";

    const jsonParser = new JsonOutputParser<{
        question: string;
        answer: string;
        distractors: string[];
    }[]>();

    // Generate MCQ questions using the related context and subtopics
    const lectureMCQPrompt = PromptTemplate.fromTemplate(LectureMCQPrompt);

    // Create a runnable sequence for generating MCQs
    const mcqPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            generated_content: (input) => input.generated_content.join("\n"),
            format_instructions: (input) => input.formatInstructions,

        },
        lectureMCQPrompt,
        getChatModel,
        jsonParser
    ]);

    const mcqQuestions = await mcqPipeline.invoke({
        context: context,
        lesson_title: lesson_title,
        generated_content: generatedContent,
        formatInstructions,
    });

    return mcqQuestions;
}

// MARK: generate post-assessment MCQs
export async function generatePostAssessmentMCQs(lesson_title: string, generatedContent: string[]) {
    const context = await documentRetrievalPipeline(lesson_title);

    // Generate post-assessment MCQ questions using the related context and main points
    const postAssessmentMCQPrompt = PromptTemplate.fromTemplate(PostAssessmentMCQPrompt);

    // Create a runnable sequence for generating post-assessment MCQs
    const postAssessmentPipeline = RunnableSequence.from([
        {
            context: (input) => input.context,
            lesson_title: (input) => input.lesson_title,
            generated_content: (input) => input.generated_content.join("\n")
        },
        postAssessmentMCQPrompt,
        getChatModel,
        new StringOutputParser()
    ]);

    const postAssessmentQuestions = await postAssessmentPipeline.invoke({
        context: context,
        lesson_title: lesson_title,
        generated_content: generatedContent
    });

    return postAssessmentQuestions;
}
