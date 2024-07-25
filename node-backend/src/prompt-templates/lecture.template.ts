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

//export const lectureIntroductionPompt = `gene
