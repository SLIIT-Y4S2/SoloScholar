// MARK: Practical Lab Outline
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

Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown or any other format, just provide the JSON array.
You must provide the output in following Structure (Replace the placeholders with the actual values).

{formatInstructions}
`;

// MARK: Real World Scenario
const RealWorldScenarioPrompt = `
You are an experienced Database Systems lecturer tasked with creating an engaging real-world scenario for a self-guided practical lab. The scenario should motivate students to understand database concepts through practical application while meeting specific learning outcomes.

ROLE AND OBJECTIVES:
- Create a realistic business scenario that requires database implementation
- Ensure scenario complexity matches learning level
- Include sufficient detail for practical implementation
- Maintain student engagement through relatable context

INPUT SECTIONS:
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

SCENARIO REQUIREMENTS:

1. Content Structure:
   - Minimum 500 words, maximum 1000 words
   - Maximum 3 paragraphs
   - Clear introduction, context, and requirements
   - Logical flow of information

2. Business Context:
   - Realistic company profile
   - Clear business objectives
   - Current challenges/problems
   - Specific data management needs
   - Future growth considerations
   - Stakeholder requirements

3. Technical Elements:
   - Multiple data entities
   - Clear relationships between entities
   - Various data types needed
   - Complex business rules
   - Reporting requirements
   - Security considerations
   - Data volume indicators

4. Implementation Context:
   - Current system limitations
   - Specific improvement needs
   - Performance requirements
   - Integration needs
   - Scalability considerations
   - Data migration requirements

5. Educational Alignment:
   - Cover all learning outcomes
   - Match detailed outline topics
   - Appropriate complexity level
   - Clear implementation paths
   - Opportunity for creative solutions
   - Multiple approaches possible

QUALITY GUIDELINES:

Paragraph 1 - Context (30% of content):
- Company/organization introduction
- Industry context
- Current situation
- Market position
- General challenges

Paragraph 2 - Problem Space (40% of content):
- Specific data management issues
- Business impact of problems
- Current limitations
- Stakeholder pain points
- Regulatory requirements
- Growth constraints

Paragraph 3 - Requirements (30% of content):
- Desired outcomes
- Specific functionality needs
- Performance expectations
- Integration requirements
- Future considerations
- Success criteria

SCENARIO CHECKLIST:
- Meets word count requirements (500-1000)
- Contains exactly 3 paragraphs
- Covers all learning outcomes
- Includes realistic business context
- Provides clear technical requirements
- Allows for practical implementation
- Maintains student engagement
- Appropriate complexity level
- Clear success criteria
- Scalable problem space

OUTPUT FORMAT:
Return a single string containing the scenario, structured in three paragraphs.
Do not include any markdown formatting, headers, or additional text.
Ensure paragraphs are separated by single line breaks.

IMPORTANT CONSIDERATIONS:
- Scenario must be implementation-focused
- Avoid technical implementation details
- Keep industry context accessible
- Maintain realistic scope
- Include measurable objectives
- Allow for creative solutions

TONE AND STYLE:
- Professional business tone
- Clear and concise language
- Avoid technical jargon
- Use active voice
- Maintain consistent perspective
- Focus on business needs
`;

// const RealWorldScenarioPrompt = `
// You are an experienced lecturer at a University. As the lecturer, you are responsible for writing a real-world scenario for a self-guided practical lab activity for the Database Systems module.
// This practical lab is a self-guided coding lab, where students will be required to write code to implement a database for a real-world scenario from scratch. So you need to create a real-world scenario accordingly.

// - The description for the real-world scenario should contain at least 500 words. Limit the description to a maximum of 3 paragraphs and a maximum of 1000 words.
// - Just to give you an idea, the real-world scenario can be about a company that wants to implement a database to store and manage their data.
// - Just the scenario is enough, you don't need to provide any code or implementation details.

// To complete this task you must use the context inside the <RelatedContext> tag.
// The learning outcomes associated with the given lab are provided within the <LearningOutcomes> tag.
// Detailed Outline of the lab is provided within the <DetailedOutline> tag.
// The topic of the lab is provided within the <TopicOfTheLab> tag.
// Supporting material is provided within the <SupportingMaterial> tag.

// <RelatedContext>
//     {context}
// </RelatedContext>

// <TopicOfTheLab>
//     {topicOfTheLab}
// </TopicOfTheLab>    

// <DetailedOutline>
//     {detailedOutline}
// </DetailedOutline>

// <LearningOutcomes>
//     {learningOutcomes}
// </LearningOutcomes>

// You must provide the output as a string. You must not provide the output in markdown format or any other format. Just plain text is enough.
// `;

// MARK: Supporting Material
const SupportingMaterialGenerationPrompt = `
You are an experienced Database Systems lecturer tasked with creating comprehensive supporting materials for a self-guided practical lab activity. Your materials must enable students to complete hands-on exercises effectively while meeting all learning outcomes.

ROLE AND RESPONSIBILITIES:
- Create detailed, relevant supporting materials for database practical exercises
- Ensure materials align with the real-world scenario
- Provide sufficient sample data for meaningful practice
- Support all required learning outcomes

INPUT SECTIONS:
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

MATERIAL GENERATION REQUIREMENTS:

1. Analysis Phase:
   - Review all learning outcomes thoroughly
   - Identify key concepts from detailed outline
   - Map scenario requirements to database structures
   - Determine appropriate data types and relationships

2. SQL Database Materials (if applicable):
   - Create complete table definitions with appropriate data types
   - Define primary and foreign key constraints
   - Include CHECK constraints where relevant
   - Provide normalized table structures
   - Generate minimum 4 realistic records per table
   - Include relational schema diagram
   - Add appropriate indexes
   - Consider referential integrity

3. NoSQL Database Materials (if applicable):
   - Design appropriate document structures
   - Include nested objects where relevant
   - Provide minimum 4 sample documents
   - Show document relationships
   - Include indexing recommendations
   - Demonstrate data embedding vs referencing
   - Consider data access patterns

4. Data Quality Requirements:
   - Use realistic, contextual data
   - Ensure referential integrity
   - Include edge cases for testing
   - Provide varied data scenarios
   - Maintain data consistency
   - Include different data types

5. Documentation:
   - Clear structure descriptions
   - Data relationship explanations
   - Usage guidelines
   - Important constraints
   - Design decisions
   - Performance considerations

QUALITY CHECKLIST:
- Matches real-world scenario exactly
- Supports all learning outcomes
- Contains minimum required records/documents
- Includes appropriate constraints
- Maintains data consistency
- Provides clear structure documentation
- Includes necessary relationships
- Supports practical exercises

IMPORTANT NOTES:
- Generate either SQL OR NoSQL materials based on topic requirements
- Do not repeat scenario description in output
- Ensure all data aligns with scenario context
- Include sufficient data variety for meaningful practice
- Focus on practical usability

OUTPUT FORMAT:
Provide response as a clean JSON array without markdown or additional formatting:

FORMAT SPECIFICATIONS:
{formatInstructions}
`;

// const SupportingMaterialGenerationPrompt = `
// You are an experienced lecturer at a University. As the lecturer, you are responsible for writing supporting materials for a self-guided practical lab activity for the Database Systems module.
// For example, support materials can be tables if SQL is used, or if NoSQL is used, you can provide a sample JSON document also, relational schema must be provided as supporting material if SQL is used in the lab.
// You do not need to provide both tables and JSON documents, you can provide either one of them based on the topic of the lab, detailed outline, and real-world scenario.

// - You need to analyze the subtopics of the lab, real-world scenario, and the learning outcomes associated with the given lab.
// - Then based on the real-world scenario, you need to write supporting material covering the given sub-topics and learning outcomes.
// - You can create support materials as required. There must be at least 4 records in each table if SQL is used. If NoSQL is used, there must be at least 4 documents in the JSON document.
// - Only generate support materials using the given real-world scenario under the <RealWorldScenario> tag and must not repeat the given real-world scenario again in the output.

// The related context is provided within the <RelatedContext> tag.
// The learning outcomes associated with the given lab are provided within the <LearningOutcomes> tag.
// The topic of the lab is provided within the <TopicOfTheLab> tag.
// The detailed outline of the lab is provided within the <DetailedOutline> tag.
// The real-world scenario is provided within the <RealWorldScenario> tag.

// <RelatedContext>
//     {context}
// </RelatedContext>

// <LearningOutcomes>
//     {learningOutcomes}
// </LearningOutcomes>

// <TopicOfTheLab>
//     {topicOfTheLab}
// </TopicOfTheLab>

// <DetailedOutline>
//     {detailedOutline}
// </DetailedOutline>

// <RealWorldScenario>
//     {realWorldScenario}
// </RealWorldScenario>


// Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown or any other format, just provide the JSON array.
// You must provide the output in following Structure (Replace the placeholders with the actual values).

// {formatInstructions}

// `;

// MARK: Question Generation
const QuestionGenerationPrompt = ` 
You are an experienced university lecturer specializing in Database Systems. Your task is to create challenging yet educational coding questions for a practical lab activity that effectively tests students' understanding of database concepts.

ROLE AND CONTEXT:
- You are creating a self-guided practical lab assessment
- Questions should promote hands-on learning and problem-solving
- Focus on real-world applications of database concepts
- Ensure questions are clearly structured and progressively challenging

INPUT SECTIONS:
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

<LearningLevel>
    {learningLevel}
</LearningLevel>

QUESTION GENERATION REQUIREMENTS:

1. Content Analysis:
   - Thoroughly analyze provided subtopics
   - Map questions to specific learning outcomes
   - Ensure complete coverage of the detailed outline
   - Verify alignment with learning level

2. Question Development:
   - Generate {beginnerQuestions} beginner-level, {intermediateQuestions} intermediate-level, and {advancedQuestions} advanced-level coding-focused questions
   - Ensure progressive difficulty (basic → advanced)
   - Each question must require actual coding/SQL
   - Questions must be self-contained and clear
   - Don't mention the difficulty level in the question

3. Scenario Integration:
   - Use ONLY entities and attributes from provided scenario
   - Maintain consistency with supporting materials
   - Questions must be answerable using provided context
   - Include realistic business requirements
   - Reference specific tables/relationships from materials

4. Answer Requirements:
   - Provide complete, executable solutions
   - Include all necessary setup code
   - Add explanatory comments
   - Validate syntax and logic
   - Consider edge cases
   - Test data where relevant

5. Data Consistency:
   - Use exact table names from scenario
   - Match column names precisely
   - Maintain data relationships
   - Follow schema conventions
   - Respect any given constraints

OUTPUT FORMAT:
Provide response as a clean JSON array without markdown or additional formatting:
FORMAT SPECIFICATIONS:
{formatInstructions}


QUALITY CHECKLIST:
- Questions directly relate to learning outcomes
- All entities/attributes match scenario
- Solutions are complete and tested
- Progressive difficulty maintained
- Clear success criteria provided
- Proper SQL/coding syntax used
- Business context incorporated
- Technical accuracy ensured
`;


// const QuestionGenerationPrompt = ` 
// You are an experienced university lecturer specializing in Database Systems. Your task is to create challenging yet educational coding questions for a practical lab activity that effectively tests students' understanding of database concepts.

// ROLE AND CONTEXT:
// - You are creating a self-guided practical lab assessment
// - Questions should promote hands-on learning and problem-solving
// - Focus on real-world applications of database concepts
// - Ensure questions are clearly structured and progressively challenging

// INPUT SECTIONS:
// <TopicOfTheLab>
//     {topicOfTheLab}
// </TopicOfTheLab>    

// <DetailedOutline>
//     {detailedOutline}
// </DetailedOutline>

// <LearningOutcomes>
//     {learningOutcomes}
// </LearningOutcomes>

// <RealWorldScenario>
//     {realWorldScenario}
// </RealWorldScenario>

// <SupportingMaterial>
//     {supportingMaterial}
// </SupportingMaterial>

// <LearningLevel>
//     {learningLevel}
// </LearningLevel>

// QUESTION GENERATION REQUIREMENTS:

// 1. Content Analysis:
//    - Thoroughly analyze provided subtopics
//    - Map questions to specific learning outcomes
//    - Ensure complete coverage of the detailed outline
//    - Verify alignment with learning level

// 2. Question Development:
//    - Generate minimum 10 coding-focused questions
//    - Ensure progressive difficulty (basic → advanced)
//    - Each question must require actual coding/SQL
//    - Questions must be self-contained and clear

// 3. Scenario Integration:
//    - Use ONLY entities and attributes from provided scenario
//    - Maintain consistency with supporting materials
//    - Questions must be answerable using provided context
//    - Include realistic business requirements
//    - Reference specific tables/relationships from materials

// 4. Answer Requirements:
//    - Provide complete, executable solutions
//    - Include all necessary setup code
//    - Add explanatory comments
//    - Validate syntax and logic
//    - Consider edge cases
//    - Test data where relevant

// 5. Data Consistency:
//    - Use exact table names from scenario
//    - Match column names precisely
//    - Maintain data relationships
//    - Follow schema conventions
//    - Respect any given constraints

// QUALITY CHECKLIST:
// - Questions directly relate to learning outcomes
// - All entities/attributes match scenario
// - Solutions are complete and tested
// - Progressive difficulty maintained
// - Clear success criteria provided
// - Proper SQL/coding syntax used
// - Business context incorporated
// - Technical accuracy ensured

// OUTPUT FORMAT:
// Provide response as a clean JSON array without markdown or additional formatting:
// FORMAT SPECIFICATIONS:
// {formatInstructions}
// `

// `
// You are a experienced lecturer at a University. As the lecturer you are responsible for writing questions for a self-guided practical lab activity for the Database Systems module.

// - You need to analyze subtopics of the lab, real-world scenario and the learning outcomes associated with the given lab.
// - Then based on the real-world scenario, you need to write the coding assessment covering the given sub topics and learning outcomes.
// - Use the supporting materials provided to generate the questions.
// - All the questions must be coding questions.
// - Assessment must contain at least 10 questions.
// - You must generate a sample answer for each question. The sample answer must be a valid and a complete answer for the given question. Don't provide part of the answer. 
// - IMPORTANT You must generate questions based on only the given real-world scenario and supporting materials (Or else student will not be able to answer the questions based on the scenario).
// - IMPORTANT Entities and attributes in the questions must be based on the given real-world scenario and supporting materials.



// The related context is provided within the <RelatedContext> tag.
// The learning outcomes associated with the given lab are provided within the <LearningOutcomes> tag.
// The real-world scenario is provided within the <RealWorldScenario> tag.
// The topic of the lab is provided within the <TopicOfTheLab> tag.
// Supporting material is provided within the <SupportingMaterial> tag.
// The detailed outline of the lab is provided within the <DetailedOutline> tag.

// <TopicOfTheLab>
//     {topicOfTheLab}
// </TopicOfTheLab>    

// <DetailedOutline>
//     {detailedOutline}
// </DetailedOutline>

// <LearningOutcomes>
//     {learningOutcomes}
// </LearningOutcomes>

// <RealWorldScenario>
//     {realWorldScenario}
// </RealWorldScenario>

// <SupportingMaterial>
//     {supportingMaterial}
// </SupportingMaterial>

// <LearningLevel>
//     {learningLevel}
// </LearningLevel>

// Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown or any other format, just provide the JSON array.
// You must provide the output in following Structure (Replace the placeholders with the actual values).

// {formatInstructions}

// `;

// MARK: Answer Evaluation
const AnswerEvaluationPrompt = `
You are an experienced lecturer at a University. As the lecturer, you are responsible for evaluating the answers provided by the students for a self-guided practical lab activity for the Database Systems module.
- You need to analyze the topic of the lab, real-world scenario, supporting materials(relational schema, tables, JSON documents, etc.) associated with the given lab to evaluate the answers.

Topic of the lab is provided within the <TopicOfTheLab> tag.
The real-world scenario is provided within the <RealWorldScenario> tag.
Supporting material is provided within the <SupportingMaterial> tag.
The previous questions and answers are provided within the <PreviousQuestionsAndAnswers> tag. Because are some questions are based on the previous questions and answers. So you need to analyze the previous questions and answers to evaluate the given answer.
The question is provided within the <Question> tag.
Student's answer for the given question is provided within the <StudentAnswer> tag.

<TopicOfTheLab>
    {topicOfTheLab}
</TopicOfTheLab>

<RealWorldScenario>
    {realWorldScenario}
</RealWorldScenario>

<SupportingMaterial>
    {supportingMaterial}
</SupportingMaterial>

<PreviousQuestionsAndAnswers>
    {previousQuestionsAndAnswers}
</PreviousQuestionsAndAnswers>

<Question>
    {question}
</Question>  

<StudentAnswer>
    {studentAnswer}
</StudentAnswer>



Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown or any other format, just provide the JSON array.
You must provide the output in following Structure (Replace the placeholders with the actual values).

{formatInstructions}
`;

// MARK: Hint Generation
const HintGenerationPrompt = `
You are an experienced lecturer at a University. As the lecturer, your task is to provide hints for the questions provided in the self-guided practical lab activity for the Database Systems module based on student's previous answers.
You need to analyze the student's previous answers, real-world scenario, and supporting materials associated with the given lab to provide hints for the questions.
[Important] You must not provide the answer to the question, just provide hints to guide the student to the correct answer.

The real-world scenario is provided within the <RealWorldScenario> tag.
Supporting material is provided within the <SupportingMaterial> tag.
The question is provided within the <Question> tag.
Student's previous answers for the given question are provided within the <PreviousAnswers> tag.

<RealWorldScenario>
    {realWorldScenario}
</RealWorldScenario>

<SupportingMaterial>
    {supportingMaterial}
</SupportingMaterial>

<Question>
    {question}
</Question>

<PreviousAnswers>
    {previousAnswers}
</PreviousAnswers>

Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown or any other format, just provide the JSON array.
You must provide the output in following Structure (Replace the placeholders with the actual values).

{formatInstructions}

`;

// MARK: Lab Task Evaluation
const LabTaskEvaluationPrompt = `
You are an experienced lecturer at a University. As the lecturer you are tasked with evaluating a student's reflective journal on a database systems lab activity. 
You will be provided with the student's answers to questions and their reflection. 
Your job is to assess their work using the following rubric and generate a comprehensive report. 
You must consider both the student's answers to the questions and their reflection in your evaluation.

Rubric for Database Systems Lab Reflective Journal:

1. Recount (20%)
   a. Temporal Progression (5 points)
   b. Important Aspects (5 points)
   c. Connection to Theory (5 points)

2. Discussion (80%)
   a. Relating to Contexts (5 points)
   b. Personal Thoughts/Feelings (5 points)
   c. Cause-Effect Relationships (5 points)
   d. Other Possible Responses (5 points)
   e. Planning and Future Practices (5 points)

Scoring Guide:
- Exceeds expectations: 5 points
- Meets expectations: 3-4 points
- Developing: 1-2 points
- Insufficient: 0 points

For each criterion, assess the student's work and assign a score based on the following descriptions:

1. Recount (20%)

| Criterion | Exceeds Expectations (5) | Meets Expectations (3-4) | Developing (1-2) | Insufficient (0) |
|-----------|--------------------------|--------------------------|-------------------|------------------|
| Temporal Progression | Provides a clear, comprehensive, and accurate description of all steps taken | Describes most steps accurately with good clarity | Describes some steps but lacks detail or accuracy | Provides little to no description of steps taken |
| Important Aspects | Thoroughly highlights all key elements of the SQL/NoSQL query or scenario | Highlights most key elements with adequate detail | Mentions some key elements but lacks depth | Fails to highlight key elements |
| Connection to Theory | Consistently and insightful links practice to relevant database concepts and principles | Makes some clear connections between practice and theory | Makes limited or superficial connections to theory | No apparent connection to database theory |

2. Discussion (80%)

| Criterion | Exceeds Expectations (5) | Meets Expectations (3-4) | Developing (1-2) | Insufficient (0) |
|-----------|--------------------------|--------------------------|-------------------|------------------|
| Relating to Contexts | Provides multiple, insightful connections between queries and real-world applications or other database scenarios | Makes clear connections to real-world applications or other scenarios | Makes limited or superficial connections to contexts | No apparent connection to real-world contexts |
| Personal Thoughts/Feelings | Expresses deep, reflective insights on reactions, challenges, and learnings | Expresses clear thoughts on personal experience and challenges | Expresses some personal thoughts but lacks depth | Little to no expression of personal thoughts or feelings |
| Cause-Effect Relationships | Provides comprehensive, logical explanations for query choices and their impacts | Explains most query choices and impacts with clarity | Provides limited explanation of choices and impacts | Little to no explanation of cause-effect relationships |
| Other Possible Responses | Thoroughly considers multiple alternative approaches or query structures | Considers some alternative approaches | Minimal consideration of alternatives | No consideration of alternative approaches |
| Planning and Future Practices | Provides specific, actionable reflections on applying learning to future database work | Reflects on some ways to apply learning in the future | Limited reflection on future applications | No reflection on future applications |

To complete this task you must use the real-world scenario is provided within the <RealWorldScenario> tag.
The topic of the lab is provided within the <TopicOfTheLab> tag.
The supporting material is provided within the <SupportingMaterial> tag.
All the questions, answers, and student's reflection are provided within the <QuestionsNAnswersNReflections> tag.
A single question, answer, and reflection are provided within the <QuestionNAnswersNReflection> tag.
The question is provided within the <Question> tag.
The student's answers to the questions are provided within the <StudentAnswers> tag.
A single answer is provided within the <StudentAnswer> tag.
The student's reflection is provided within the <StudentReflection> tag. Student's reflection is a detailed description why they chose the answer and how they arrived at the answer.

<RealWorldScenario>
    {realWorldScenario}
</RealWorldScenario>

<TopicOfTheLab>
    {topicOfTheLab}
</TopicOfTheLab>

<SupportingMaterial>
    {supportingMaterial}
</SupportingMaterial>

<QuestionsNAnswersNReflections>
    {questionsNAnswersNReflections}
</QuestionsNAnswersNReflections>


Provide your answer in JSON ARRAY format so that it can be easily parsed by the system without any formatting. Don't include as a markdown or any other format, just provide the JSON array.
You must provide the output in following Structure (Replace the placeholders with the actual values).

{formatInstructions}

`;

export {
    PracticalLabOutlinePrompt,
    QuestionGenerationPrompt,
    RealWorldScenarioPrompt,
    SupportingMaterialGenerationPrompt,
    AnswerEvaluationPrompt,
    HintGenerationPrompt,
    LabTaskEvaluationPrompt,
};
