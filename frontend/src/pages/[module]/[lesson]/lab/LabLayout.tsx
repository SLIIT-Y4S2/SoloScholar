import { Layout } from "antd";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { Outlet } from "react-router-dom";
import { LabProvider } from "../../../../provider/lab/LabContext";

export function LabLayout() {
    return (
        <LabProvider>
            <Layout className="flex flex-col gap-4 container mx-auto h-max">
                <CustomBreadcrumb />
                <Outlet />
            </Layout>
        </LabProvider>
    )
}