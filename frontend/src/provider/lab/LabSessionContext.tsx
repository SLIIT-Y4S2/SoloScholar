import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { evaluateStudentsAnswer, getLabExerciseById, getHintForQuestion } from "../../services/lab.service";
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
    isAnsForCurrQuesCorrect: boolean | null;
    isLabCompleted: boolean;
    evaluateStudentAnswerHandler: (answer: string) => void;
    getHintForCurrentQuestion: () => void;
    goToNextQuestion: () => void;
}

interface LabQuestion {
    id: number
    question_number: number;
    question: string;
    answer: string;
    example_question: string;
    example_answer: string;
    isCorrect: boolean | null;
    currentAnswer: string | null;
    current_question_index: number;
    isAnswered: boolean;
    attempts: number;
    student_answers: {
        id: number;
        student_answer: string;
        labsheet_questionId: number;
    }[]
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
    const [hintForCurrentQuestion, setHintForCurrentQuestion] = useState<string>("");
    const [isAnsForCurrQuesCorrect, setIsAnsForCurrQuesCorrect] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [isGenerationError, setIsGenerationError] = useState<boolean>(false);

    const params = useParams();

    useEffect(() => {
        setIsLoading(true);
        const { labSheetId } = params;
        if (!labSheetId) {
            return;
        }
        // If labSheetId is present, fetch the lab sheet
        getLabExerciseById(labSheetId)
            .then((response) => {
                const labSheet = response.data;
                setRealWorldScenario(labSheet.real_world_scenario);
                setSupportMaterials(labSheet.supportMaterial);
                setQuestions([
                    ...labSheet.labsheet_question.map((data: LabQuestion) => {
                        return ({
                            id: data.id,
                            question_number: data.question_number,
                            question: data.question,
                            answer: data.answer,
                            exampleQuestion: data.example_question,
                            exampleAnswer: data.example_answer,
                            isCorrect: data.isCorrect,
                            currentAnswer: data.student_answers.length == 0 ? null : data.student_answers[data.student_answers.length - 1].student_answer,
                            attempts: data.student_answers.length,
                        })
                    }),
                ]);
                setIsAnsForCurrQuesCorrect(labSheet.labsheet_question[labSheet.current_question_index].isCorrect);
                setCurrentQuestionIndex(labSheet.current_question_index);
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
            if (!labSheetId) {
                return;
            }
            setIsEvaluatingAnswer(true);

            // Evaluate the answer
            evaluateStudentsAnswer(
                answer, labSheetId, questions[currentQuestionIndex].id).then((response) => {
                    console.log("Is correct", response.data);
                    setQuestions((prevQuestions) =>
                        prevQuestions.map((question, index) =>
                            index === currentQuestionIndex
                                ? {
                                    ...question,
                                    currentAnswer: answer,
                                    isAnswered: true,
                                    attempts: question.attempts + 1,
                                    isCorrect: response.data.studentAnswerEvaluation.isCorrect
                                }
                                : question
                        )
                    );
                    setIsAnsForCurrQuesCorrect(response.data.studentAnswerEvaluation.isCorrect);
                    setIsEvaluatingAnswer(false);

                    console.log("Questions", questions[currentQuestionIndex]);
                }).catch((error) => {
                    console.log("Error evaluating answer", error);
                    setIsEvaluatingAnswer(false);
                });
        },
        [labSheetId, questions, currentQuestionIndex, setIsEvaluatingAnswer]
    );

    /**
     * Get hint for the current question
     */
    const getHintForCurrentQuestion = useCallback(
        () => {
            if (!labSheetId) {
                return;
            }
            getHintForQuestion(labSheetId, questions[currentQuestionIndex].question_number).then((response) => {
                console.log("Hint for current question", response.data);
                setHintForCurrentQuestion(JSON.stringify(response.data));
            });

        }, [setHintForCurrentQuestion, labSheetId, currentQuestionIndex, questions]);

    const goToNextQuestion = useCallback(
        () => {
            if (currentQuestionIndex < totalQuestions - 1) {
                setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                setHintForCurrentQuestion("");
                setIsAnsForCurrQuesCorrect(questions[currentQuestionIndex + 1].isCorrect);
            } else {
                setIsLabCompleted(true);
            }
        }, [questions, currentQuestionIndex, totalQuestions, setCurrentQuestionIndex, setHintForCurrentQuestion, setIsLabCompleted]
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
            isGenerationError,
            evaluateStudentAnswerHandler,
            getHintForCurrentQuestion,
            goToNextQuestion,
            setIsGenerationError
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
            isGenerationError,
            evaluateStudentAnswerHandler,
            getHintForCurrentQuestion,
            goToNextQuestion,
            setIsGenerationError
        ]
    );

    return (
        <LabSessionProviderContext.Provider value={contextValues}>
            {children}
        </LabSessionProviderContext.Provider>
    );
}
