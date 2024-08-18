import { useLocation } from "react-router-dom";
import QuestionCardForLab from "../../../../Components/lab/QuestionCardForLab";
import { useLabSessionContext } from "../../../../provider/lab/LabSessionContext";
import { CompletedLab } from "../../../../Components/lab/CompletedLab";
import { QuestionCardForLabSkeleton } from "../../../../Components/lab/QuestionCardForLabSkeleton";
import { Button, Result, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useLabContext } from "../../../../provider/lab/LabContext";

export default function LabSession() {
  const location = useLocation();
  const { status, isDataFetching } = useLabSessionContext();
  const { isGenerationError } = useLabContext();



  if (isDataFetching) {
    return <Spin tip={"Loading"} indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} fullscreen />;
  }

  if (status === "COMPLETED" || status === "EVALUATED") {
    return (
      <CompletedLab />
    )
  }

  if (isGenerationError) {
    return (
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary">Back Home</Button>}
      />
    );
  }


  if (status === "GENERATED" || status === "IN_PROGRESS") {
    return (
      <div className="flex items-center justify-center py-6" key={location.key}>
        <div className="flex flex-col gap-6 w-max">
          <QuestionCardForLab />
        </div >
      </div>
    );
  }

  if (status === "GENERATING") {
    return (
      <div className="flex items-center justify-center py-6">
        <QuestionCardForLabSkeleton />
      </div >
    );
  }

}
