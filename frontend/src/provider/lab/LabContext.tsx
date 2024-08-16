import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getLabExerciseByModuleAndLessonName } from "../../services/lab.service";
import { useParams } from "react-router-dom";

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


    const { module, lesson } = useParams();

    if (!module || !lesson) {
        throw new Error("Module and lesson are required");
    }


    useEffect(() => {
        setIsLoading(true);

        // Fetch labSheet data
        getLabExerciseByModuleAndLessonName(module, lesson)
            .then((response) => {
                setPreviousLabSheetSummary(response.data);
                setIsLoading(false);
            }).catch((error) => {
                console.error("Error fetching labSheet data: ", error);
                setIsLoading(false);
            }
            );
    }, [lesson, module]);

    const contextValue = useMemo(() => ({ previousLabSheetSummary, isLoading, isGenerationError, setIsGenerationError }), [previousLabSheetSummary, isLoading, isGenerationError]);

    return <LabContext.Provider value={contextValue}>{children}</LabContext.Provider>;
}