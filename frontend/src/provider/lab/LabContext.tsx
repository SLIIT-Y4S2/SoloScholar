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

    const { module, lesson } = useParams();

    if (!module || !lesson) {
        throw new Error("Module and lesson are required");
    }


    useEffect(() => {
        setIsLoading(true);
        console.log("Fetching labSheet data");

        // Fetch labSheet data
        getLabExerciseByModuleAndLessonName(module, lesson)
            .then((response) => {
                setPreviousLabSheetSummary(response.data);
                setIsLoading(false);
                console.log("LabSheet data fetched successfully", response.data);
            }).catch((error) => {
                console.error("Error fetching labSheet data: ", error);
                setIsLoading(false);
            }
            );
    }, [lesson, module]);

    const contextValue = useMemo(() => ({ previousLabSheetSummary, isLoading }), [previousLabSheetSummary, isLoading]);

    return <LabContext.Provider value={contextValue}>{children}</LabContext.Provider>;
}