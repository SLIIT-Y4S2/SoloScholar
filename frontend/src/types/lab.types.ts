export type JSONDocument =
    | string
    | number
    | boolean
    | null
    | { [key: string]: JSONDocument }
    | JSONDocument[];


export type SupportingMaterial = {
    tables?: {
        tableName: string;
        columns: {
            name: string;
            type: string;
        }[];
        rows: {
            [key: string]: string | number | boolean | null | undefined;
        }[];
    }[];
    jsonDocument?: JSONDocument;
    relationalSchema?: {
        [tableName: string]: {
            name: string;
            type: string;
        }[];
    };
};

export type LabSheet = {
    realWorldScenario: string;
    detailedLabOutline: {
        subTopics: {
            title: string;
            description: string;
        }[];
    };
    supportingMaterial: SupportingMaterial;
    questions: {
        question: string;
        answer: string;
        exampleQuestion: string;
        exampleAnswer: string;
    }[];
};
