import { createContext, ReactNode, useContext, useState } from "react";
import { labSheet } from "../dummyData/labQuestions";

interface LabProviderProps {
    children: ReactNode;
}

interface LabContextType {
    questions: LabQuestion[];
    currentQuestionIndex: number;
    totalQuestions: number;
    isLoading: boolean;
    evaluateAnswer: (answer: string) => void;
}

interface LabQuestion {
    question: string;
    answer: string;
    exampleQuestion: string;
    exampleAnswer: string;
    isCorrect: boolean;
    userAnswers: string[];
    currentAnswer: string | null;
    isAnswered: boolean;
    attempts: number;
}

const LabProviderContext = createContext<LabContextType | null>(null);

export function useLabContext() {
    const value = useContext(LabProviderContext);
    if (!value) {
        throw new Error("useLabProvider must be used within a LabProvider");
    }
    return value;
}


//TODO: Complete the LabProvider function
export function LabProvider({ children }: LabProviderProps) {

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [questions, setQuestions] = useState<LabQuestion[]>(labSheet.questions.map((question) => {
        return {
            isCorrect: false,
            userAnswers: [],
            currentAnswer: null,
            isAnswered: false,
            attempts: 0,
            question: question.question,
            answer: question.answer,
            exampleQuestion: question.exampleQuestion,
            exampleAnswer: question.exampleAnswer
        }
    })
    );

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const totalQuestions = labSheet.questions.length;

    //TODO: Implement the logic to evaluate the answer from backend
    function evaluateAnswer(answer: string) {
        setIsLoading(true);
        const currentQuestion = questions[currentQuestionIndex];
        if (currentQuestion.answer.toLowerCase() === answer.toLowerCase()) {
            console.log(currentQuestion.answer, answer);

            currentQuestion.isCorrect = true;
        }
        currentQuestion.isAnswered = true;
        currentQuestion.userAnswers.push(answer);
        currentQuestion.attempts += 1;

        setTimeout(() => {
            setIsLoading(false);
        }, 15000);

        setQuestions([...questions]);
        setCurrentQuestionIndex((prev) => prev + 1);

    }


    return (
        <LabProviderContext.Provider value={{ currentQuestionIndex, totalQuestions, questions, isLoading, evaluateAnswer }}>
            {children}
        </LabProviderContext.Provider>
    );
}