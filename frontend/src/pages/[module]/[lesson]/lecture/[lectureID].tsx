
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { ModuleProvider } from "../../../../provider/ModuleContext";
import { Button, Layout } from "antd";






// @ts-ignore
import { Experience } from "../../../../Components/lecture/Experience.jsx";
import LectureSidebar from "../../../../Components/lecture/LectureSidebar.js";


export default function Lab() {
    return (
        <ModuleProvider>
            <Layout className="flex flex-col gap-8 my-6 mx-4 h-max ">
                <CustomBreadcrumb />

                <LectureSidebar />

            </Layout>
        </ModuleProvider>
    );
}
