import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { labSheet } from "../../dummyData/labQuestions";
import { evaluateStudentsAnswer, getLabExerciseById } from "../../services/lab.service";
import { SupportingMaterial } from "../../types/lab.types";
import { useParams } from "react-router-dom";

interface LabSessionProviderProps {
    children: ReactNode;
}

interface LabSessionContextType {
    realWorldScenario: string;
    supportMaterials: SupportingMaterial;
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

const LabSessionProviderContext = createContext<LabSessionContextType | null>(null);

export function useLabSessionContext() {
    const value = useContext(LabSessionProviderContext);
    if (!value) {
        throw new Error("useLabProvider must be used within a LabProvider");
    }
    return value;
}

//TODO: Complete the LabProvider function
export function LabSessionProvider({ children }: LabSessionProviderProps) {
    
    const [questions, setQuestions] = useState<LabQuestion[]>([]);
    const [realWorldScenario, setRealWorldScenario] = useState<string>("");
    const [supportMaterials, setSupportMaterials] = useState<SupportingMaterial>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

    const [isLabCompleted, setIsLabCompleted] = useState<boolean>(false);

    const [hintForCurrentQuestion, setHintForCurrentQuestion] =
        useState<string>("");

    const [isAnsForCurrQuesCorrect, setIsAnsForCurrQuesCorrect] =
        useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const totalQuestions = labSheet.questions.length;

    const params = useParams();

    useEffect(() => {
        setIsLoading(true);
        const { labSheetId } = params;
        console.log("LabSheetId", params);

        if (!labSheetId) {
            return;
        }
        getLabExerciseById(labSheetId)
            .then((response) => {
                const labSheet = response.data;
                setRealWorldScenario(labSheet.real_world_scenario);
                setSupportMaterials(labSheet.supportMaterial);
                setQuestions(labSheet.labsheet_question);
                setIsLoading(false)
            })
            .catch((error) => {
                console.log("Error fetching lab sheet:", error);
                setIsLoading(false);
            });
    }, [params]);

    //TODO: Implement the logic to evaluate the answer from backend
    const evaluateAnswer = useCallback(
        async (answer: string) => {
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
        },
        [questions, currentQuestionIndex, setIsLoading, setIsAnsForCurrQuesCorrect]
    );

    const getHintForCurrentQuestion = useCallback(
        async () => {
            setHintForCurrentQuestion("Hint for the current question");
        }, [setHintForCurrentQuestion]);

    const goToNextQuestion = useCallback(
        async () => {
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setHintForCurrentQuestion("");
                setIsAnsForCurrQuesCorrect(false);
            } else {
                setIsLabCompleted(true);
            }
        }, [currentQuestionIndex, totalQuestions, setCurrentQuestionIndex, setHintForCurrentQuestion, setIsLabCompleted]
    );

    const contextValues = useMemo<LabSessionContextType>(
        () => ({
            realWorldScenario,
            supportMaterials,
            questions,
            currentQuestionIndex,
            totalQuestions,
            isLoading,
            hintForCurrentQuestion,
            isAnsForCurrQuesCorrect,
            isLabCompleted,
            evaluateAnswer,
            getHintForCurrentQuestion,
            goToNextQuestion,

        }),
        [
            realWorldScenario,
            supportMaterials,
            questions,
            currentQuestionIndex,
            totalQuestions,
            isLoading,
            hintForCurrentQuestion,
            isAnsForCurrQuesCorrect,
            isLabCompleted,
            evaluateAnswer,
            getHintForCurrentQuestion,
            goToNextQuestion,
        ]
    );

    return (
        <LabSessionProviderContext.Provider value={contextValues}>
            {children}
        </LabSessionProviderContext.Provider>
    );
}
