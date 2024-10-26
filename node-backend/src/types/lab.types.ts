export type SupportingMaterial = {
    tables?: {
        tableName: string;
        columns: {
            name: string;
            type: string;
        }[];
        rows: {
            [key: string]: any;
        }[];
    }[];
    jsonDocument?: any;
    relationalSchema?: {
        [tableName: string]: {
            name: string;
            type: string;
        }[];
    };
};


interface LabQuestion {
    question: string;
    answer: string;
    isCorrect: boolean;
    studentAnswers: string[];
    currentAnswer: string | null;
    isAnswered: boolean;
    attempts: number;
}

export interface LabSheet {
    realWorldScenario: string;
    supportMaterials: SupportingMaterial;
    questions: LabQuestion[];
    currentQuestionIndex: number;
    totalQuestions: number;
    isLoading: boolean;
    hintForCurrentQuestion: string;
    isAnsForCurrQuesCorrect: boolean;
    isLabCompleted: boolean;
}

