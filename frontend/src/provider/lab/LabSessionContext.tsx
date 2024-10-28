import {
    createContext,
    ReactNode,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { evaluateStudentsAnswer, getLabExerciseById, getHintForQuestion, updateSubmissionStatus, updateLabSheetStatusAsCompleted } from "../../services/lab.service";
import { LabStatus, SupportingMaterial } from "../../types/lab.types";
import { useParams } from "react-router-dom";
import { message } from "antd";

interface LabSessionProviderProps {
    children: ReactNode;
}

interface LabSessionContextType {
    status?: LabStatus;
    realWorldScenario: string;
    supportMaterials: SupportingMaterial;
    questions: LabQuestion[];
    currentQuestionIndex: number;
    totalQuestions: number;
    isDataFetching: boolean;
    isEvaluatingAnswer: boolean;
    hintForCurrentQuestion: string;
    isAnsForCurrQuesCorrect: boolean | null;
    isLabCompleted: boolean;
    isFeedbackEnabled: boolean;
    overallScore: number;
    strengths: string[] | null;
    areasForImprovement: string[] | null;
    recommendations: string[] | null;
    evaluateStudentAnswerHandler: (answer: string) => void;
    getHintForCurrentQuestion: () => void;
    goToNextQuestion: (reflection: string | null) => void;
    submitLabSheet: (reflection: string | null) => void;
}

interface LabQuestion {
    id: number
    question_number: number;
    question: string;
    answer: string;
    is_correct: boolean | null;
    current_answer: string | null;
    current_question_index: number;
    is_answered: boolean;
    attempts: number;
    student_answers: {
        id: number;
        student_answer: string;
        labsheet_questionId: number;
    }[],
    is_answer_submitted: boolean;
    reflection_on_answer: string;
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

    const [status, setStatus] = useState<LabStatus>();
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
    const [isFeedbackEnabled, setIsFeedbackEnabled] = useState<boolean>(false);
    const [overallScore, setOverallScore] = useState<number>(0);
    const [strengths, setStrengths] = useState<string[]>([]);
    const [areasForImprovement, setAreasForImprovement] = useState<string[] | null>([]);
    const [recommendations, setRecommendations] = useState<string[]>([]);

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
                setStatus(labSheet.status);
                setRealWorldScenario(labSheet.real_world_scenario);
                setSupportMaterials(labSheet.supportMaterial);
                setIsFeedbackEnabled(labSheet.is_feedback_enabled);
                setOverallScore(labSheet.overall_score);
                setStrengths(JSON.parse(labSheet.strengths));
                setAreasForImprovement(JSON.parse(labSheet.areas_for_improvement));
                setRecommendations(JSON.parse(labSheet.recommendations));
                setQuestions([
                    ...labSheet.labsheet_question.map((data: LabQuestion) => {
                        return ({
                            id: data.id,
                            question_number: data.question_number,
                            question: data.question,
                            answer: data.answer,
                            is_correct: data.is_correct,
                            current_answer: data.student_answers.length == 0 ? null : data.student_answers[data.student_answers.length - 1].student_answer,
                            attempts: data.student_answers.length,
                            is_answer_submitted: data.is_answer_submitted,
                            reflection_on_answer: data.reflection_on_answer,
                        })
                    }),
                ]);
                setIsAnsForCurrQuesCorrect(labSheet.labsheet_question[labSheet.current_question_index - 1].is_correct);
                setCurrentQuestionIndex(labSheet.current_question_index - 1);
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
                                    current_answer: answer,
                                    isAnswered: true,
                                    attempts: question.attempts + 1,
                                    isCorrect: response.data.studentAnswerEvaluation.is_correct
                                }
                                : question
                        )
                    );
                    setIsAnsForCurrQuesCorrect(response.data.studentAnswerEvaluation.isCorrect);
                    setIsEvaluatingAnswer(false);

                }).catch((error) => {
                    console.log("Error evaluating answer", error);
                    message.error("Error evaluating answer");
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
                setHintForCurrentQuestion(response.data.hint);
            });

        }, [setHintForCurrentQuestion, labSheetId, currentQuestionIndex, questions]);

    const goToNextQuestion = useCallback(
        (reflection: string | null) => {
            if (!labSheetId) {
                return;
            }

            if (currentQuestionIndex < totalQuestions - 1) {
                updateSubmissionStatus(labSheetId, questions[currentQuestionIndex].id, reflection).then(() => {
                    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
                    setHintForCurrentQuestion("");
                    setIsAnsForCurrQuesCorrect(questions[currentQuestionIndex + 1].is_correct);
                }).catch((error) => {
                    console.log("Error updating submission status", error);
                });
            } else {
                setIsLabCompleted(true);
                // Show success message and reload the page after 3 seconds to show the feedback
                message.success("Lab sheet submitted successfully");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }
        }, [questions, currentQuestionIndex, totalQuestions, setCurrentQuestionIndex, setHintForCurrentQuestion, setIsLabCompleted, labSheetId]
    );

    const submitLabSheet = useCallback(
        (reflection: string | null) => {
            if (!labSheetId) {
                return;
            }
            updateLabSheetStatusAsCompleted(labSheetId, questions[currentQuestionIndex].id, reflection).then(() => {
                setIsLabCompleted(true);
                // Show success message and reload the page after 3 seconds to show the feedback
                message.success("Lab sheet submitted successfully");
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            }).catch((error) => {
                console.log("Error updating submission status", error);
            });
        }, [labSheetId, questions, currentQuestionIndex, setIsLabCompleted]);

    const contextValues = useMemo<LabSessionContextType>(
        () => ({
            status,
            realWorldScenario,
            supportMaterials,
            questions,
            currentQuestionIndex,
            totalQuestions,
            isDataFetching: isLoading,
            hintForCurrentQuestion,
            isAnsForCurrQuesCorrect,
            isLabCompleted,
            isEvaluatingAnswer,
            isGenerationError,
            isFeedbackEnabled,
            overallScore,
            strengths,
            areasForImprovement,
            recommendations,
            evaluateStudentAnswerHandler,
            getHintForCurrentQuestion,
            goToNextQuestion,
            setIsGenerationError,
            submitLabSheet
        }),
        [
            status,
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
            isFeedbackEnabled,
            overallScore,
            strengths,
            areasForImprovement,
            recommendations,
            evaluateStudentAnswerHandler,
            getHintForCurrentQuestion,
            goToNextQuestion,
            setIsGenerationError,
            submitLabSheet
        ]
    );

    return (
        <LabSessionProviderContext.Provider value={contextValues}>
            {children}
        </LabSessionProviderContext.Provider>
    );
}
