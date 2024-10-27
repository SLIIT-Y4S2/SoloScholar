// All the template

// Prompt to generate lecture introduction
export const LectureIntroductionPrompt = `
You are an experienced lecturer at a University. You are about to start a new lecture. Generate the lecture script related introduction for the lecture.
Lesson Title: {lesson_title}
Lesson Plan:
{lesson_plan}

Make sure to attract the user to the topic by providing a real-world scenario related to the lesson. Don't use phrases like "Good morning, everyone!". but use greatings like "Hi, there!". Don't start directly from life scinario, first introduce the topic and then relate it to real-world scenario. Don't add any markdown formats. And don't use any uncommon english words like "paramount","bustling","grasp" etc.
`;

export const LearningOutcomesLecturePrompt = `
You are an experienced lecturer at a University. generate the transcript for the learning outcomes section of the lecture. Don't give markdown format.


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

Level Information: 
{levelInfo}

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
You are an experienced lecturer at a university. Generate 5 multiple-choice questions (MCQs) that assess understanding of the lecture content. For each question include 4 answer choices. 

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

// export const MarkdownPPTSlidePrompt = `
// Lesson Title: {lesson_title}
// Content: {content}

// Generate a visually structured markdown presentation for the above content. Follow these guidelines:

// 1. Create a title slide with the lesson title.
// 2. Break the content into logical sections, each on its own slide.
// 3. Use headings (# and ##) to structure the content hierarchy.
// 4. Utilize bullet points and numbered lists for easy readability.
// 5. Keep each slide focused on a single concept or idea.
// 6. Include simple ASCII diagrams or tables where appropriate to visualize concepts.
// 7. End with a summary or key takeaways slide.

// Example structure:

// \`\`\`markdown
// ## {lesson_title}

// ---

// ## Introduction
// - Brief overview of the topic
// - Why it's important

// ---

// ## Key Concept 1
// - Definition
// - Examples
// - Use cases

// ---

// ## Key Concept 2
// - Explanation
// - Comparison with Concept 1
// - ASCII diagram (if applicable)

// ---

// ## Summary
// - Recap of main points
// - Next steps or further reading

// \`\`\`

// Generate the slides based on this structure, adapting as necessary to fit the specific content of the lesson.
// `;

export const MarkdownPPTSlidePrompt = `
Lesson Title: {lesson_title}
Content: {content}

go through the content and identify slides to make. after that create me a html div like below. This is sample output. So no need to have exact same thing in every title. and no need to include \`\`\`html. just the div structure is enough. if there is any code block or sql query in the content, include it in the slide using <pre> and <code> tags. If there is samll explanations please include it as a pargraph. as example if there is a word Atomicity in the content, include a small explanation about it in the slide. Ignore this inside Introduction and Learning Outcomes Overview topics.

Example output:
\`\`\`html
<div class="slides">
    
    <section>
        <h2>Topic</h2>
        <ul>
            <li>Brief overview of the topic</li>
            <li>Why it's important</li>
        </ul>
    </section>
    <section>
        <h2>Key Concept 1</h2>
        <ul>
            <li>Definition</li>
            <li>Examples</li>
            <li>Use cases</li>
        </ul>
    </section>
    <section>
        <h2>Key Concept 2</h2>
        <ul>
            <li>Explanation</li>
            <li>Comparison with Concept 1</li>
            <li>ASCII diagram (if applicable)</li>
            <li>Code sample</li>
            <pre><code data-trim data-noescape>
            (def lazy-fib
             (concat
                [0 1]
                 ((fn rfib [a b]
                      (lazy-cons (+ a b) (rfib b (+ a b)))) 0 1)))
            </code></pre>
        </ul>
    </section>
    <section>
        <h2>Summary</h2>
        <ul>
            <li>Recap of main points</li>
            <li>Next steps or further reading</li>
        </ul>
    </section>
`;
