import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getLabExerciseByModuleAndLessonName } from "../../services/lab.service";
import { useParams } from "react-router-dom";
import { message } from "antd";

interface LabProviderProps {
    readonly children: ReactNode;
}

interface LabSheetDataSummary {
    id: string;
    createAt: string;
    status: string;
    learningLevel: string;
}

interface LabContextType {
    previousLabSheetSummary: LabSheetDataSummary[] | null;
    generatedLearningLevel: string[] | null;
    isLoading: boolean;
    isGenerationError: boolean;
    setIsGenerationError: React.Dispatch<React.SetStateAction<boolean>>;
}


const LabContext = createContext<LabContextType | null>(null);

export function useLabContext() {
    const context = useContext(LabContext);
    if (!context) {
        throw new Error("useLabContext must be used within a LabProvider");
    }

    return context;
}

export function LabProvider({ children }: LabProviderProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [previousLabSheetSummary, setPreviousLabSheetSummary] = useState<LabSheetDataSummary[]>([]);
    const [isGenerationError, setIsGenerationError] = useState<boolean>(false);
    const [generatedLearningLevel, setGeneratedLearningLevel] = useState<string[] >([]);



    const { module, lesson } = useParams();

    if (!module || !lesson) {
        throw new Error("Module and lesson are required");
    }


    useEffect(() => {
        setIsLoading(true);

        // Fetch labSheet data
        getLabExerciseByModuleAndLessonName(module, lesson)
            .then((response) => {
                setPreviousLabSheetSummary(response.data.labSheet);
                setGeneratedLearningLevel(response.data.remainingLevels);
                setIsLoading(false);
            }).catch((error) => {
                console.error("Error fetching labSheet data: ", error);
                message.error("Error fetching labSheet data");
                setIsLoading(false);
            }
            );
    }, [lesson, module]);

    const contextValue = useMemo(() => ({ previousLabSheetSummary, isLoading, isGenerationError, setIsGenerationError, generatedLearningLevel }), [previousLabSheetSummary, isLoading, isGenerationError, generatedLearningLevel]);

    return <LabContext.Provider value={contextValue}>{children}</LabContext.Provider>;
}