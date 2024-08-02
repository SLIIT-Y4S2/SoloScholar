import { Button, Modal } from "antd";
import { Link, useParams } from "react-router-dom";
import { SupportMaterialsForLab } from "../../../../Components/lab/SupportMaterialsForLab";
import QuestionCardForLab from "../../../../Components/lab/QuestionCardForLab";
import { FileMarkdownOutlined } from "@ant-design/icons";
import { useState } from "react";

export default function LabSession() {
  const [open, setOpen] = useState<boolean>(false);
  const { labSheetId } = useParams();
  return (
    <div className="flex items-center justify-center py-6">
      <div className="flex flex-col gap-6 w-max">
        <Button className="w-max" onClick={() => setOpen(true)}><FileMarkdownOutlined />Support Material</Button>
        <Modal open={open} onCancel={() => setOpen(false)} width={1000} footer={[]}>
          <Link to={`../${labSheetId}/support-material`} relative={"path"} target="_blank">
            <div className="text-base font-bold py-2 px-4 border-2 border-solid border-red-600 w-max text-red-600 rounded-xl">
              Open in a new tab
            </div>
          </Link>
          <SupportMaterialsForLab />
        </Modal>
        <QuestionCardForLab />
      </div >
    </div>
  );
}
