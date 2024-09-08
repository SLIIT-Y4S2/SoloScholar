import { Layout } from "antd";
// import { ModuleProvider } from "../../../../provider/ModuleContext"; //TODO: remove
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { Outlet } from "react-router-dom";
import { LabProvider } from "../../../../provider/lab/LabContext";

export function LabLayout() {
    return (
        // <ModuleProvider>
            <LabProvider>
                <Layout className="flex flex-col gap-8 my-6 mx-4 h-max">
                    <CustomBreadcrumb />
                    <Outlet />
                </Layout>
            </LabProvider>
        // </ModuleProvider>
    )
}