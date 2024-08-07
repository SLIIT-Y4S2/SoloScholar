import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
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
    isEvaluatingAnswer: boolean;
    hintForCurrentQuestion: string;
    isAnsForCurrQuesCorrect: boolean;
    isLabCompleted: boolean;
    evaluateStudentAnswerHandler: (answer: string) => void;
    getHintForCurrentQuestion: () => Promise<void>;
    goToNextQuestion: () => void;
}

interface LabQuestion {
    id: string
    question_number: number;
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

export function LabSessionProvider({ children }: Readonly<LabSessionProviderProps>) {

    const [questions, setQuestions] = useState<LabQuestion[]>([]);
    const [realWorldScenario, setRealWorldScenario] = useState<string>("");
    const [supportMaterials, setSupportMaterials] = useState<SupportingMaterial>({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
    const [isLabCompleted, setIsLabCompleted] = useState<boolean>(false);
    const [labSheetId, setLabSheetId] = useState<string | null>(null);
    const [isEvaluatingAnswer, setIsEvaluatingAnswer] = useState<boolean>(false);

    const [hintForCurrentQuestion, setHintForCurrentQuestion] =
        useState<string>("");

    const [isAnsForCurrQuesCorrect, setIsAnsForCurrQuesCorrect] =
        useState<boolean>(false);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [totalQuestions, setTotalQuestions] = useState<number>(0);

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
                setQuestions([
                    ...labSheet.labsheet_question.map((question: LabQuestion) => ({
                        id: question.id,
                        question_number: question.question_number,
                        question: question.question,
                        answer: question.answer,
                        exampleQuestion: question.exampleQuestion,
                        exampleAnswer: question.exampleAnswer,
                        isCorrect: false,
                        studentAnswers: [],
                        currentAnswer: null,
                        isAnswered: false,
                        attempts: 0,
                    })),
                ]);
                setTotalQuestions(labSheet.labsheet_question.length);
                setLabSheetId(labSheetId);
                setIsLoading(false)
            })
            .catch((error) => {
                console.log("Error fetching lab sheet:", error);
                setIsLoading(false);
            });
    }, [params]);

    /**
     * Evaluate the student's answer
     */
    const evaluateStudentAnswerHandler = useCallback(
        (answer: string) => {
            console.log("Evaluating answer", answer);
            if (!labSheetId) {
                return;
            }
            setIsEvaluatingAnswer(true);

            // Evaluate the answer
            evaluateStudentsAnswer(
                answer, labSheetId, questions[currentQuestionIndex].id).then((response) => {
                    console.log("Is correct", response.data.studentAnswerEvaluation.isCorrect);
                    if (response.data.studentAnswerEvaluation.isCorrect) {
                        setQuestions((prevQuestions) =>
                            prevQuestions.map((question, index) =>
                                index === currentQuestionIndex
                                    ? {
                                        ...question,
                                        studentAnswers: [...question.studentAnswers, answer],
                                        currentAnswer: answer,
                                        isAnswered: true,
                                        attempts: question.attempts + 1,
                                        isCorrect: true
                                    }
                                    : question
                            )
                        );
                        setIsAnsForCurrQuesCorrect(true);
                    } else {
                        setQuestions((prevQuestions) =>
                            prevQuestions.map((question, index) =>
                                index === currentQuestionIndex
                                    ? {
                                        ...question,
                                        studentAnswers: [...question.studentAnswers, answer],
                                        currentAnswer: answer,
                                        isAnswered: true,
                                        attempts: question.attempts + 1,
                                        isCorrect: false
                                    }
                                    : question
                            )
                        );
                    }

                    setIsEvaluatingAnswer(false);
                    console.log("Questions", questions[currentQuestionIndex]);
                }).catch((error) => {
                    console.log("Error evaluating answer", error);
                    setIsEvaluatingAnswer(false);
                });
        },
        [labSheetId, questions, currentQuestionIndex, setIsEvaluatingAnswer]
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
            isEvaluatingAnswer,
            evaluateStudentAnswerHandler,
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
            isEvaluatingAnswer,
            evaluateStudentAnswerHandler,
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
