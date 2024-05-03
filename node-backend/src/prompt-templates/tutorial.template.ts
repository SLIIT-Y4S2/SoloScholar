//All the template

// First we need to expand the lesson plant to include all the context for the subtopics

const DetailedLessonOutline = `You are a lecturer in a University. Create a detailed lesson outline for the following subtopics. Using the context provided below, create a lesson outline for each subtopic. Be verbose. Provide as much detail as possible.

Not detailed Lesson Outline:
{lessonOutline}

<RelatedContext>
    {context}
</RelatedContext>

Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown. Just provide the JSON array.

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

// // convert to json so that (We need to go a particular subtopic and get all the context for that subtopic)

// const JSONDetailedLessonOutline = `
// Convert the following lesson plan to JSON format so that it can be easily parsed by the system without any formatting.

//   [
//     {{
//       "subtopic": " subtopic 1 here",
//       "Description": " description ",
//     }},
//     {{
//       "subtopic": " subtopic 2 here",
//       "Description": " description ",
//     }},
//   ]

//   <lessonOutline>
//     {lesson_plan}
//   </lessonOutline>
//   `;

/**
 * Get all the context for a subtopic
 * Generate questions for each subtopic
 *
 * TODO: This is a dummy prompt template. Replace it with the actual prompt template
 *
 */

const GenerateQuestions = `
You are a tutor in a University. 
Create questions for the following subtopics. 
The questions should be based on the learning outcomes and blooms levels provided.

Using the context provided below, create questions for each subtopic. Be verbose. Provide as much detail as possible.

Students will not be able to see the context provided below when answering the questions so make sure the questions are clear and concise.

Subtopic: {subtopic}
Description for the subtopic : {description}
Learning outcomes: {learningOutcomes}
Blooms Levels: {bloomsLevels}
Learning Rate: {learningRate}
Total number of questions: {totalNumberOfQuestions}


<RelatedContext>
  {context}
</RelatedContext>

Provide your answer in JSON format as a array so that it can be easily parsed by the system without any formatting. Don't include as a markdown. Just provide the JSON array.

And use the following structure (replace the placeholders with your answer):

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

export {
  DetailedLessonOutline,
  // JSONDetailedLessonOutline,
  GenerateQuestions,
};
