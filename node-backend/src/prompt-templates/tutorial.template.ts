//All the template

// First we need to expand the lesson plant to include all the context for the subtopics

export const DetailedLessonOutlinePrompt = `
You are a experienced lecturer at a University. 
Create a detailed lesson outline for the following subtopics. Using the context provided below, create a lesson outline for each subtopic. Be verbose. Provide as much detail as possible.

To complete this task you must use the context inside the <RelatedContext> tag.
An incomplete outline for the lesson is provided within the <IncompleteOutline> tag.

<RelatedContext>
{context}
</RelatedContext>

<IncompleteOutline>
{lessonOutline}
</IncompleteOutline>

Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown or any other format, just provide the JSON array.

And use the following structure (replace the placeholders with your answer):

   [
    {{
    "subtopic": "Subtopic 1 here",
    "description": "description"
    }}
    ,
    {{
      "subtopic": "Subtopic 2 here",
      "Description": "description"
    }},
  ]

`;

export const GenerateQuestionsPrompt = `
You are an experienced assessment setter at a university. As the exam setter, you are responsible for writing assessment materials for undergraduate courses. Your job involves creating questions for the following subtopics:

Subtopic: {subtopic}
Description for the subtopic : {description}

These questions should be based on the given learning outcomes and Bloom's Taxonomy levels. 

QUESTION REQUIREMENTS:
- Create questions that are relevant to the subtopic.
- Ensure that the questions are clear and concise.

Avoid creating questions that are too similar to each other.

Use the context provided below to create questions for the subtopic. Be clear and concise in your questions. Make sure the questions are relevant to the subtopic and learning outcomes.

<RelatedContext>
  {context}
</RelatedContext>

Students will not be able to see the above context when answering the questions, so make sure the questions are clear and concise.


Learning outcomes: {learningOutcomes}
Blooms Levels: {bloomsLevels}
Learning Rate: {learningRate}
Total number of questions needs to be created: {totalNumberOfQuestions}



Provide your answer in JSON format as a array so that it can be easily parsed by the system without any formatting. Don't include as a markdown. Just provide the JSON array.

And use the following structure (replace the placeholders with actual values):

   [
    {{
    "question": "Question 1 here",
    "answer": "Answer"
    }}
    ,
    {{
      "question": "Question 2 here",
      "answer": "Answer"
    }},
  ]
`;
