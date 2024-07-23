const PracticalLabOutlinePrompt = `
You are an experienced lecturer at a University. As the lecturer you are responsible for writing an outline for a practical lab activity for the Database Systems module.

- To write the outline, you have to analyze the incomplete outline provided within the <IncompleteOutline> tag.
- For each subtopic int the incomplete outline you need to provide a title and a description.
- The description must emphasize the key points and concepts that students need to understand and Bloom's Taxonomy levels associated with the learning outcomes.

To complete this task you must use the context inside the <RelatedContext> tag.
The learning outcomes associated with the practical lab activity are provided within the <LearningOutcomes> tag.

Be verbose and provide as much detail as possible.

<RelatedContext>
    {context}
</RelatedContext>

<IncompleteOutline>
    {incompleteOutline}
</IncompleteOutline>

<LearningOutcomes>
    {learningOutcomes}
</LearningOutcomes>
You must not provide the output in markdown format or any other format.
You must provide the output in following JSON format (Replace the placeholders with the actual values).
{formatInstructions}
`;

const RealWorldScenarioPrompt = `
You are an experienced lecturer at a University. As the lecturer, you are responsible for writing a real-world scenario for a self-guided practical lab activity for the Database Systems module.
This practical lab is a self-guided coding lab, where students will be required to write code to implement a database for a real-world scenario from scratch. So you need to create a real-world scenario accordingly.

- The description for the real-world scenario should contain at least 500 words. Limit the description to a maximum of 3 paragraphs and a maximum of 1000 words.
- Just to give you an idea, the real-world scenario can be about a company that wants to implement a database to store and manage their data.
- Just the scenario is enough, you don't need to provide any code or implementation details.

To complete this task you must use the context inside the <RelatedContext> tag.
The learning outcomes associated with the given lab are provided within the <LearningOutcomes> tag.
Detailed Outline of the lab is provided within the <DetailedOutline> tag.

<RelatedContext>
    {context}
</RelatedContext>

<DetailedOutline>
    {detailedOutline}
</DetailedOutline>

<LearningOutcomes>
    {learningOutcomes}
</LearningOutcomes>

You must provide the output as a string. You must not provide the output in markdown format or any other format. Just plain text is enough.
`;

const SupportingMaterialGenerationPrompt = `
You are an experienced lecturer at a University. As the lecturer, you are responsible for writing supporting materials for a self-guided practical lab activity for the Database Systems module.
For example, support materials can be tables if SQL is used, or if NoSQL is used, you can provide a sample JSON document also, relational schema must be provided as supporting material if SQL is used in the lab.
You do not need to provide both tables and JSON documents, you can provide either one of them based on the topic of the lab, detailed outline, and real-world scenario.

- You need to analyze the subtopics of the lab, real-world scenario, and the learning outcomes associated with the given lab.
- Then based on the real-world scenario, you need to write supporting material covering the given sub-topics and learning outcomes.
- You can create support materials as required.
- Only generate support materials using the given real-world scenario under the <RealWorldScenario> tag and must not repeat the given real-world scenario again in the output.

The related context is provided within the <RelatedContext> tag.
The learning outcomes associated with the given lab are provided within the <LearningOutcomes> tag.
The topic of the lab is provided within the <TopicOfTheLab> tag.
The detailed outline of the lab is provided within the <DetailedOutline> tag.
The real-world scenario is provided within the <RealWorldScenario> tag.

<RelatedContext>
    {context}
</RelatedContext>

<LearningOutcomes>
    {learningOutcomes}
</LearningOutcomes>

<TopicOfTheLab>
    {topicOfTheLab}
</TopicOfTheLab>

<DetailedOutline>
    {detailedOutline}
</DetailedOutline>

<RealWorldScenario>
    {realWorldScenario}
</RealWorldScenario>


You must provide the output in the following JSON format (Replace the placeholders with the actual values). You must not provide the output in markdown format or any other format.: 
{formatInstructions}

`;

const QuestionGenerationPrompt = `
You are a experienced lecturer at a University. As the lecturer you are responsible for writing questions for a self-guided practical lab activity for the Database Systems module.

- You need to analyze subtopics of the lab, real-world scenario and the learning outcomes associated with the given lab.
- Then based on the real-world scenario, you need to write the coding assessment covering the given sub topics and learning outcomes.
- Use the supporting materials provided to generate the questions.
- All the questions must be coding questions.
- Assessment must contain at least 10 questions.
- You must generate a sample answer for each question.
- Also you must generate a example question and answer pair for each question. 
These example question and answer pairs must be similar but not related to the original question and answer pair. But they must cover the same learning outcomes detailed outline and real-world scenario.

The related context is provided within the <RelatedContext> tag.
The learning outcomes associated with the given lab are provided within the <LearningOutcomes> tag.
The real-world scenario is provided within the <RealWorldScenario> tag.
The topic of the lab is provided within the <TopicOfTheLab> tag.
Supporting material is provided within the <SupportingMaterial> tag.
The detailed outline of the lab is provided within the <DetailedOutline> tag.

<RelatedContext>
    {context}
</RelatedContext>

<TopicOfTheLab>
    {topicOfTheLab}
</TopicOfTheLab>    

<DetailedOutline>
    {detailedOutline}
</DetailedOutline>

<LearningOutcomes>
    {learningOutcomes}
</LearningOutcomes>

<RealWorldScenario>
    {realWorldScenario}
</RealWorldScenario>

<SupportingMaterial>
    {supportingMaterial}
</SupportingMaterial>

You must provide the output in the following JSON format (Replace the placeholders with the actual values). You must not provide the output in markdown format or any other format.: 
{formatInstructions}

`;

export { PracticalLabOutlinePrompt, QuestionGenerationPrompt, RealWorldScenarioPrompt, SupportingMaterialGenerationPrompt };

