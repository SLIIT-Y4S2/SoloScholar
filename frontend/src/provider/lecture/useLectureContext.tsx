import { useContext } from "react";
import { LectureProviderContext } from "./LectureContext";

export function useLectureContext() {
    const value = useContext(LectureProviderContext);
    if (!value) {
        throw new Error(
            "useLectureProvider must be used within a LectureProvider"
        );
    }
    return value;
}

export { LectureProviderContext };
