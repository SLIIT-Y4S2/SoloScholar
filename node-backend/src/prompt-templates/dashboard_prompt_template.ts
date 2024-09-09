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
3. Prioritize using the following contextually relevant tables to identify the relationships among them by 
only considering their primary and foreign keys. 
{contextuallyRelevantTables}

If needed only, use the original database schema, given below, to get more information about these tables and their columns
but never use any tables or columns from the original database schema that are not available in the contextually relevant tables:
{schema}

When trying to join tables, consider joining columns of same datatype only and never include any tables or columns that are 
not available. Also, when using aliases for tables, never use reserved SQL keywords.

4. Afterward, construct all possible syntactically correct MSSQL candidate queries using the identifed tables and columns.
5. Select the best optimized query from these candidate queries required to answer the question.
6. If you are not able to construct the SQL query with the available tables and columns, or if the provided question is not meaningful at all,
never include any imaginary tables or columns of your choice. Instead, simply return the below query as it is:
{defaultQuery}

7. Please provide the response according to the below format:
{formatInstructions}

8. Question: 
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

// 3. Pay attention to only use the column names you can see in the tables. Also, pay attention to which column is in which table.
// 4. Only use the following original database schema:
// {schema}
