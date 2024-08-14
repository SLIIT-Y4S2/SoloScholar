
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { ModuleProvider } from "../../../../provider/ModuleContext";
import { Button, Layout } from "antd";




// @ts-ignore
import {Experience} from "../../../../Components/lecture/Experience.jsx";
// import ListSection from "../../../../Components/lecture/ListSection.jsx";

export default function Lab() {
    return (
        <ModuleProvider>
            <Layout className="flex flex-col gap-8 my-6 mx-4 h-max ">
                <CustomBreadcrumb />
                {/* <ListSection /> */}
                
            </Layout>
        </ModuleProvider>
    );
}
