import { LabSessionProvider } from "../../../../provider/lab/LabSessionContext";
import { Outlet } from "react-router-dom";

export function LabSessionLayout() {
    return (
        <LabSessionProvider>
            <Outlet />
        </LabSessionProvider>
    )
}