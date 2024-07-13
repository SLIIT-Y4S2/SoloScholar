import QuestionCardForLab from "../Components/QuestionCardForLab";
import { LabProvider } from "../provider/LabContext";
import CustomBreadcrumb from "../Components/CustomBreadcrumb";
import Sidebar from "../Components/Sidebar";
import { ModuleProvider } from "../provider/ModuleContext";

export default function Lab() {
    return (
        <ModuleProvider>
            <div className="grid grid-cols-[auto,1fr] flex-grow ">
                <Sidebar />
                <div className="flex flex-col gap-8 my-6 mx-4">
                    {/* Remove static values */}
                    <CustomBreadcrumb
                        module={{ title: "Database Management Systems-SE3020", path: "/modules/dbms" }}
                        topic={{ title: "SQL", path: "/modules/dbms/sql" }}
                        materialType={{ title: "Lab", path: "/modules/dbms/sql/lab" }}
                    />
                    <LabProvider>
                        <QuestionCardForLab />
                    </LabProvider>
                </div>
            </div>

        </ModuleProvider>

    );
}