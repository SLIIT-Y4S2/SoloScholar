import { z } from "zod";

// // Define the output parser for the detailed lab outline using Zod schema
// export const zodSchemaForDetailedLabOutline = z.array(
//     z.object({
//         topic: z.string().describe("The title of the subtopic"),
//         description: z.string().describe("The description of the subtopic"),
//     })
// );

// Define the output parser for the real-world scenario prompt using Zod
export const zodSchemaForRealWorldScenario = z.string().describe("The real-world scenario for the lab activity");


// Define zod schemas for the supporting materials


// Schema for columns in a table
export const columnSchema = z.object({
    name: z.string().describe("The name of the column"),
    type: z.string().describe("The data type of the column"),
});

// Schema for rows in a table
const exampleRowSchema = z.record(z.string(), z.union([z.string(), z.number(), z.boolean(), z.date()])).describe("Schema for example rows in a table");

// Schema for tables
const zodSchemaForTables = z.object(
    {
        tableName: z.string().describe("The name of the table"),
        columns: z.array(columnSchema).describe("The columns of the table"),
        rows: z.array(exampleRowSchema).describe("The example rows of the table"),
    }
);

// Schema for json documents
const zodSchemaForJsonDocuments = z.object(
    {
        collections:
            z.array(
                z.object(
                    {
                        collectionName: z.string().describe("The name of the collection"),
                        exampleDocuments: z.array(
                            z.record(
                                z.string(),
                                z.union([z.string(), z.number(), z.boolean(), z.date()])
                            )
                        ).describe("The example documents in the collection"),
                    }
                )
            )
    }
);

// Schema for relational schema
const relationalSchemaSchema = z.record(
    z.string(),
    z.array(columnSchema)
).describe("A record of table names to their columns");


// Schema for supporting material
export const zodSchemaForSupportingMaterial = z.object(
    {
        tables: z.array(zodSchemaForTables.optional()).describe("An optional list of tables if SQL is used else empty array"),
        jsonDocument: zodSchemaForJsonDocuments.optional().describe("An optional JSON document schema  if NoSQL is used else empty object"),
        relationalSchema: relationalSchemaSchema.optional().nullable().describe("An optional relational schema if SQL is used. You must provide a relational schema if you provide tables"),
    }
);


//Define the output parser for the question generation prompt using Zod
export const zodSchemaForQuestions = z.array(
    z.object({
        question: z.string().describe("The question for the lab activity"),
        answer: z.string().describe("The answer to the question"),
    })
).describe("A list of questions for the lab activity");


// Schema for the student answer evaluation for labs
export const zodSchemaForStudentAnswerEvaluation = z.object({
    isCorrect: z.boolean().describe("Whether the student answer is correct or not"),
    feedback: z.string().describe("Feedback for the student answer"),
});


// Schema for the hint generation
export const zodSchemaForHintGeneration = z.object({
    hint: z.string().describe("A hint to help the student answer the question based on the question and previous answers.")
});

export const zodSchemaForLabSheetFeedback = z.object({
    overallScore: z.number().int().min(0).max(100).describe("The overall score for the lab sheet"),
    strengths: z.array(z.string()).describe("List 5 areas where the student demonstrated strong reflective skills"),
    areasForImprovement: z.array(z.string()).describe("List 5 areas where the student could enhance their reflection"),
    recommendations: z.array(z.string()).describe("Provide 5 specific suggestions for developing reflective practice"),
})