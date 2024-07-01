import { PromptTemplate } from "@langchain/core/prompts";

/**
 * First prompt to get the SQL query
 */
export const SQL_MSSQL_PROMPT: PromptTemplate<
  {
    schema: any;
    formatInstructions: any;
    question: any;
    defaultQuery: string;
  },
  any
> = new PromptTemplate({
  template: `
  You are an MS SQL expert. Given an input question, construct a syntactically correct MS SQL query for it. 
  Unless the user specifies in the question a specific number of results to obtain, query for all the results. 
  You must include only the columns that are needed to answer the question. Pay attention to only use the column
  names you can see in the tables. Also, pay attention to which column is in which table. 

  Only use the following database schema:
  {schema}

  If you are not able to construct the SQL query with the available tables and columns, never include any imaginary
  tables or columns of your choice. Instead, simply return the below query as it is:
  {defaultQuery}

  Please provide the response according to below format:
  {formatInstructions}

  Question: {question}
  `,
  inputVariables: ["schema", "formatInstructions", "question", "defaultQuery"],
});
