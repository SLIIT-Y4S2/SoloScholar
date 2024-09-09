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
2. You must include only the columns that are needed to answer the question and always use clear and meaningful aliases for column names 
where necessary. Separate words in aliases using underscores.
3. Prioritize using the following contextually relevant tables to answer the input question. If necessary, join tables to get the required 
information by only considering their primary and foreign key relationships.
{contextuallyRelevantTables}

If needed only, use the original database schema, given below, to identify other tables, columns and relationships to the above contextually 
relevant tables. If necessary, you can join these tables with the contextually relevant tables:
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
