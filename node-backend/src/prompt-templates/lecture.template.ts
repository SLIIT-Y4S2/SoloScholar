// All the template

// Prompt to generate lecture introduction
export const LectureIntroductionPrompt = `
You are an experienced lecturer at a University. You are about to start a new lecture. Generate the lecture script related introduction for the lecture.
Lesson Title: {lesson_title}
Lesson Plan:
{lesson_plan}

Make sure to attract the user to the topic by providing a real-world scenario related to the lesson. Don't use phrases like "Good morning, everyone!". but use greatings like "Hi, there!". Don't start directly from life scinario, first introduce the topic and then relate it to real-world scenario. Don't add any markdown formats.
`;


export const LearningOutcomesLecturePrompt = `
You are an experienced lecturer at a University. generate the transcript for the learning outcomes section of the lecture.


Lesson Title: {lesson_title}
Learning Outcomes:{learning_outcomes}

Explain the learning outcomes in a clear and concise manner. Make sure to provide a brief overview of what students will be able to achieve or understand after completing the lecture.
`;

// Prompt to generate lecture section
// export const Lecturesectionprompt = `
// You are an experienced lecturer at a University. generate lecture script to feed a 3d avatar while maintaing in a flow between previouse sections and following below guidelines:

// Lesson Title: {lesson_title}
// Student Level: {learning_level} [Options: beginner, intermediate, advanced]
// Subtopic: {subtopic}
// Description: {description}

// <context>
// {context}
// </context>

// <Previous Sections>
// {prevSections}
// </Previous Sections>

// Script Format:
// - Write in a natural, conversational tone as if speaking directly to the students.
// - Use first-person pronouns (I, we, us) and address the audience as "you."
// - Break the script into short, easily deliverable sentences or phrases.
// - Avoid visual cues or references that a 3D avatar couldn't perform.

// Adjust the content and complexity based on the Student Level as follows:

// For beginner level:
// - Use simple, everyday language and explain any necessary terms
// - Focus on fundamental concepts with lots of real-world examples
// - Include frequent recap phrases like "To sum up what we've covered..."
// - Use an encouraging, patient tone

// For intermediate level:
// - Use field-specific terms, briefly explaining new concepts
// - Balance theory with practical applications and examples
// - Make connections between different ideas
// - Use a professional yet approachable tone

// For advanced level:
// - Use sophisticated, discipline-specific language
// - Discuss advanced theories and current research
// - Include critical analysis and explore nuances of the topic
// - Use a more scholarly, peer-to-peer tone

// General guidelines:
// - Maintain a natural flow without explicitly stating transitions
// - Tailor examples to the specific field of study
// - Adjust the pace and depth of explanations according to the level
// - Include rhetorical questions or prompts to engage the audience


// example output format - "Hi, there! Imagine you’re working for a cutting-edge tech company that’s developing a sophisticated online marketplace. This platform not only allows users to buy and sell products but also incorporates advanced features like personalized recommendations, dynamic pricing, and user reviews. To achieve this, the development team needs to create a robust object-relational database system that can efficiently manage a variety of entities—such as users, products, and transactions—while ensuring that the system is both flexible and scalable. In today’s lecture, we will dive into the essential concepts of member functions and inheritance, which are foundational to building such a system. We’ll explore how member functions define the behavior of objects, allowing us to encapsulate operations that can be performed on them."
// Generate the conversational lecture script now, adhering closely to these guidelines.
// `;




export const Lecturesectionprompt = `
You are an experienced lecturer at a university. Assume your are teaching for {learning_level} level student. Generate a lecture transcript for 

Lesson Title: {lesson_title}

Subtopic: {subtopic}
Description: {description}

<context>
{context}
</context>

<Previous Sections>
{prevSections}
</Previous Sections>

if student is beginner level:
- Use very simple language, avoiding jargon
- Explain every new term thoroughly
- Use abundant real-world examples and analogies
- Include frequent summaries and checkpoints
- Keep the content focused on foundational concepts only

if student is intermediate level:
- Use more technical language, briefly explaining new terms
- Dive deeper into concepts, exploring some complexities
- Discuss practical applications and industry relevance
- Make connections between different aspects of the topic
- Include some challenges or thought-provoking questions

if stundent is advanced level:
- Use highly technical language without explanations
- Focus on cutting-edge concepts and current research
- Discuss advanced applications and theoretical implications
- Analyze complex relationships between different aspects of the topic
- Include critical analysis and open research questions


Make sure to maintain a continuous flow between subtopics. Focus on delivering content without explicitly stating transitions like "Moving on to the next topic" or "Here are some questions". Don't ask students to ask questions at the end of the lecture and don't add any markdown formats.
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

Formatting Instructions:
{format_instructions}

Generate the questions without adding introductory phrases or transitions. Focus on assessing the student's understanding of the main points covered in the lecture.
`;




// prompt-templates/lecture.template.ts

export const MarkdownPPTSlidePrompt = `

Lesson Title: {lesson_title}
content : {content}

generate markdown presentation for above content
`;
