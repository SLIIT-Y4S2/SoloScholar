import { createContext, ReactNode, useContext, useState } from "react";
import { labSheet } from "../dummyData/labQuestions";
// import axios from "axios";
import { evaluateStudentsAnswer } from "../services/lab.service";

interface LabProviderProps {
    children: ReactNode;
}

interface LabContextType {
    questions: LabQuestion[];
    currentQuestionIndex: number;
    totalQuestions: number;
    isLoading: boolean;
    hintForCurrentQuestion: string;
    isAnsForCurrQuesCorrect: boolean;
    isLabCompleted: boolean;
    evaluateAnswer: (answer: string) => Promise<void>;
    getHintForCurrentQuestion: () => Promise<void>;
    goToNextQuestion: () => void;

}

interface LabQuestion {
    question: string;
    answer: string;
    exampleQuestion: string;
    exampleAnswer: string;
    isCorrect: boolean;
    studentAnswers: string[];
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
    const [questions, setQuestions] = useState<LabQuestion[]>(
        labSheet.questions.map((question) => {
            return {
                isCorrect: false,
                studentAnswers: [],
                currentAnswer: null,
                isAnswered: false,
                attempts: 0,
                question: question.question,
                answer: question.answer,
                exampleQuestion: question.exampleQuestion,
                exampleAnswer: question.exampleAnswer,
            };
        })
    );

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const [isLabCompleted, setIsLabCompleted] = useState<boolean>(false);

    const [hintForCurrentQuestion, setHintForCurrentQuestion] = useState<string>("");

    const [isAnsForCurrQuesCorrect, setIsAnsForCurrQuesCorrect] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const totalQuestions = labSheet.questions.length;

    //TODO: Implement the logic to evaluate the answer from backend
    async function evaluateAnswer(answer: string) {
        console.log("Questions", questions[currentQuestionIndex]);
        setIsLoading(true);

        // Evaluate the answer
        const isCorrectAnswer = await evaluateStudentsAnswer(
            answer,
            questions[currentQuestionIndex].answer
        );
        console.log("Is correct", isCorrectAnswer);

        // Update student answers and current answer
        setQuestions((prevQuestions) =>
            prevQuestions.map((question, index) =>
                index === currentQuestionIndex
                    ? {
                        ...question,
                        studentAnswers: [...question.studentAnswers, answer],
                        currentAnswer: answer,
                        isAnswered: true,
                        attempts: question.attempts + 1,
                        isCorrect: isCorrectAnswer,
                    }
                    : question
            )
        );

        setIsAnsForCurrQuesCorrect(isCorrectAnswer);

        setIsLoading(false);
        console.log("Questions", questions[currentQuestionIndex]?.isCorrect);
    }

    async function getHintForCurrentQuestion() {
        setHintForCurrentQuestion("Hint for the current question");
    }

    async function goToNextQuestion() {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
            setHintForCurrentQuestion("");
            setIsAnsForCurrQuesCorrect(false);
        } else {
            setIsLabCompleted(true);
        }
    }




    return (
        <LabProviderContext.Provider
            value={{
                questions,
                currentQuestionIndex,
                totalQuestions,
                isLoading,
                hintForCurrentQuestion,
                evaluateAnswer,
                getHintForCurrentQuestion,
                goToNextQuestion,
                isAnsForCurrQuesCorrect,
                isLabCompleted,
            }}
        >
            {children}
        </LabProviderContext.Provider>
    );
}
