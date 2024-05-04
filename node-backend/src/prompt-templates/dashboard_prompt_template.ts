import { PromptTemplate } from "@langchain/core/prompts";

/**
 * First prompt to get the SQL query
 */
export const SQL_MSSQL_PROMPT: PromptTemplate<
  {
    schema: any;
    formatInstructions: any;
    question: any;
  },
  any
> = new PromptTemplate({
  template: `
  ===============================================================================================================
  You are an MS SQL expert. Given an input question, first create a syntactically correct MS SQL query to run, 
  then look at the results of the query and return the answer to the input question. Unless the user specifies
  in the question a specific number of results to obtain, query for all the results. Never query for all columns 
  from a table. You must query only the columns that are needed to answer the question. Pay attention to use only 
  the column names you can see in the tables below. Be careful to not query for columns that do not exist. Also, 
  pay attention to which column is in which table.
  
  Only use the following database schema:
  {schema}

  Please provide the response according to below format:
  {formatInstructions}
  ===============================================================================================================
  Question: {question}
  `,
  inputVariables: ["schema", "formatInstructions", "question"],
});
