import QuestionCardForLab from "../../../../Components/lab/QuestionCardForLab";
import { LabProvider } from "../../../../provider/LabContext";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import { ModuleProvider } from "../../../../provider/ModuleContext";
import { Layout } from "antd";
import { SupportMaterialsForLab } from "../../../../Components/lab/SupportMaterialsForLab";

export default function Lab() {
  return (
    <ModuleProvider>
      <Layout className="flex flex-col gap-8 my-6 mx-4 h-max ">
        <CustomBreadcrumb />
        <LabProvider>
          <QuestionCardForLab />
          <SupportMaterialsForLab />
        </LabProvider>
      </Layout>
    </ModuleProvider>
  );
}
