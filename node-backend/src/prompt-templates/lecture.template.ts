// All the template

// Prompt to generate lecture introduction
export const LectureIntroductionPrompt = `
You are an experienced lecturer at a University. You are about to start a new lecture. Generate the introduction for the lecture.
Lesson Title: {lesson_title}
Lesson Plan:
{lesson_plan}

Make sure to attract the user to the topic by providing a real-world scenario related to the lesson.
`;

// Prompt to generate lecture section
export const Lecturesectionprompt = `
You are an experienced lecturer at a university. Generate a lecture transcript for 

Lesson Title: {lesson_title}
Subtopic: {subtopic}
Description: {description}

<context>
{context}
</context>

<Previous Sections>
{prevSections}
</Previous Sections>

Make sure to maintain a continuous flow between subtopics. Focus on delivering content without explicitly stating transitions like "Moving on to the next topic" or "Here are some questions."
This transcript will be fed to a 3D avatar.
`;

// Prompt to generate lecture conclusion
export const LectureConclusionPrompt = `
You are an experienced lecturer at a university. Generate a conclusion for the lecture.

Lesson Title: {lesson_title}
Generated Content:
{generated_content}

Summarize the main points covered in the lecture and provide a final thought or call to action, but do not mention anything about future sessions, farewells, or thanks. The focus should be on reinforcing the key concepts discussed.
`;


// Prompt to generate pre-assessment MCQ questions
export const LectureMCQPrompt = `
You are an experienced lecturer at a university. Generate 5 multiple-choice questions (MCQs) that assess understanding of the lecture content.

Lesson Title: {lesson_title}
Generated Content:
{generated_content}

Formatting Instructions:
{format_instructions}

Generate the questions without adding introductory phrases or transitions. Focus on testing the core concepts covered.
`;

// Prompt to generate post-assessment MCQs
export const PostAssessmentMCQPrompt = `
You are an experienced lecturer at a university. Generate 10 post-assessment multiple-choice questions (MCQs) that cover the main points of the lecture.

Lesson Title: {lesson_title}
Generated Content:
{generated_content}

Generate the questions without adding introductory phrases or transitions. Focus on assessing the student's understanding of the main points covered in the lecture.
`;
