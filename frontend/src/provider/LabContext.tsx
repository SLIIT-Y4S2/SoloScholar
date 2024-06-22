import { createContext, ReactNode, useContext, useState } from "react";
import { labSheet } from "../dummyData/labQuestions";

interface LabProviderProps {
    children: ReactNode;
}

interface LabContextType {
    questions: {
        question: string;
        answer: string;
        exampleQuestion: string;
        exampleAnswer: string;
    }[];
    currentQuestionIndex: number;
    totalQuestions: number;
}

const LabProviderContext = createContext<LabContextType | null>(null);

export function useLabContext() {
    const value = useContext(LabProviderContext);
    if (!value) {
        throw new Error("useLabProvider must be used within a LabProvider");
    }
    return value;
}

export function LabProvider({ children }: LabProviderProps) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const totalQuestions = labSheet.questions.length;
    const questions = labSheet.questions;

    return (
        <LabProviderContext.Provider value={{ currentQuestionIndex, totalQuestions, questions }}>
            {children}
        </LabProviderContext.Provider>
    );
}