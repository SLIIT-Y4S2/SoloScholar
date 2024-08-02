import { ModuleProvider } from "../../../../provider/ModuleContext";
import { Layout } from "antd";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { LabProvider } from "../../../../provider/LabContext";
import { Outlet } from "react-router-dom";

export function LabLayout() {
    return (
        <ModuleProvider>
            <Layout className="flex flex-col gap-8 my-6 mx-4 h-max">
                <CustomBreadcrumb />
                <LabProvider>
                    <Outlet />
                </LabProvider>
            </Layout>
        </ModuleProvider>

    )
}