import QuestionCardForLab from "../Components/QuestionCardForLab";
import { LabProvider } from "../provider/LabContext";

export default function Lab() {
    return (
        <LabProvider>
            <div className="flex flex-col items-center justify-center h-screen">
                <QuestionCardForLab />
            </div>
        </LabProvider>

    );
}