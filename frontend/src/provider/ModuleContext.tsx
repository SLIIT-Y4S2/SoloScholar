import { createContext, ReactNode, useContext, useState } from "react";
import { LessonOutlineType } from "../types/lesson.types";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";

interface ModuleProviderProps {
    children: ReactNode;
}

interface ModuleContextType {
    moduleName: string;
    moduleCode: string;
    lessonOutline: LessonOutlineType[];
    lectureTopic: string | null;
    setLectureTopic: (topic: string) => void;
    tutorialTopic: string | null;
    setTutorialTopic: (topic: string) => void;
    labTopic: string | null;
    setLabTopic: (topic: string) => void;
}


const ModuleContext = createContext<ModuleContextType | null>(null);

export function useModuleContext() {
    const value = useContext(ModuleContext);

    if (!value) {
        throw new Error("useModuleContext must be used within a ModuleProvider");
    }

    return value;
}

export function ModuleProvider({ children }: ModuleProviderProps) {
    const [lectureTopic, setLectureTopic] = useState<string | null>(null);
    const [tutorialTopic, setTutorialTopic] = useState<string | null>(null);
    const [labTopic, setLabTopic] = useState<string | null>(null);

    //TODO : Get the module name, module code and lesson outline from the database
    const moduleName = "Introduction to Programming";
    const moduleCode = "SE3020";
    const lessonOutline: LessonOutlineType[] = MODULE_OUTLINE_LESSON_ARRAY;



    return (
        <ModuleContext.Provider value={{ moduleName, moduleCode, lessonOutline, lectureTopic, setLectureTopic, tutorialTopic, setTutorialTopic, labTopic, setLabTopic }}>
            {children}
        </ModuleContext.Provider>
    );
}