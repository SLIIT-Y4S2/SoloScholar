import { PromptTemplate } from "@langchain/core/prompts";

/**
 * First prompt to get the SQL query
 */
export const SQL_MSSQL_PROMPT: PromptTemplate<
  {
    schema: any;
    contextuallyRelevantTables: any;
    formatInstructions: any;
    question: any;
    defaultQuery: string;
  },
  any
> = new PromptTemplate({
  template: `
You are an MSSQL expert. Given an input question, do the following:
1. Unless the user specifies in the question a specific number of results to obtain, query for all the results. 
2. You must include only the columns that are needed to answer the question and use meaningful aliases where necessary.
3. Pay attention to only use the column names you can see in the tables. Also, pay attention to which column is in which table.
4. Only use the following database schema: 
{schema}

5. Only use the following contextually relevant tables from the schema. Note that all of these tables may not be required to answer the question.
Therefore, only use the necessary tables:
{contextuallyRelevantTables}

6. Construct all possible syntactically correct MSSQL candidate queries using the provided schema.
7. Select the best optimized query from these candidate queries required to answer the question.
8. If you are not able to construct the SQL query with the available tables and columns, or if the provided question is not meaningful at all,
never include any imaginary tables or columns of your choice. Instead, simply return the below query as it is:
{defaultQuery}

9. Please provide the response according to the below format:
{formatInstructions}

10. Question: 
{question}
`,
  inputVariables: [
    "schema",
    "contextuallyRelevantTables",
    "formatInstructions",
    "question",
    "defaultQuery",
  ],
});
