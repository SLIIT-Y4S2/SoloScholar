import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";
import { Typography, Input, Button, Result, message } from "antd";
import { useContext, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import { getVisualization } from "../../utils/data_visualization_choices";
import { CustomMessage } from "../../types/dashboard.types";
import { ResultStatusType } from "antd/es/result";

const { Text } = Typography;
const { TextArea } = Input;

const CustomAnalyticalIndicatorSecondary = (props: {
  analysisGoal?: string;
  visualizationChoice?: string;
  sqlQuery?: string;
  //sqlQueryData?: any;
  customMessage?: CustomMessage;
}) => {
  const {
    analysisGoal,
    visualizationChoice,
    sqlQuery,
    //sqlQueryData,
    customMessage,
  } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const {
    //generateTabularIndicator,
    saveIndicator,
    clearData,
  } = useContext(DashboardContext);
  const [indicatorName, setIndicatorName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log("customMessage", customMessage);
  return (
    <Fragment>
      {contextHolder}
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Custom Analytical Indicator" }}
      />
      <div
        className="
        pt-[43px] pr-[46px] pb-[39px] pl-[46px]
        mt-[35px] mr-[80px] mb-[98px] ml-[45px]
        bg-[#ffff] rounded-[15px]
        "
      >
        {customMessage ? (
          <Result
            status={customMessage.type as ResultStatusType}
            title={customMessage.content}
          />
        ) : (
          <div className="grid gap-[58px]">
            <div className="flex gap-[29px] h-fit">
              <Text className="font-medium text-[16px] w-[14%]">
                Indicator Name
              </Text>
              <Input
                className="h-[42px]"
                value={indicatorName}
                onChange={(e: any) => setIndicatorName(e.target.value)}
              />
            </div>
            <div className="flex gap-[29px] h-fit">
              <Text className="font-medium text-[16px] w-[14%]">
                Your Analysis Goal
              </Text>
              <TextArea
                className="font-normal text-[14px] rounded-[5px] resize-none"
                autoSize={{ minRows: 3 }}
                value={analysisGoal}
              />
            </div>
            <div>{getVisualization(visualizationChoice ?? "")}</div>
          </div>
        )}
        <div className="flex justify-end gap-[8px] mt-[50px]">
          {customMessage ? (
            <Fragment>
              <Button
                onClick={clearData}
                hidden={customMessage.type === "warning"}
                className="rounded-[2px]"
              >
                Retry
              </Button>
              <Button
                // onClick={generateTabularIndicator(
                //   analysisGoal,
                //   sqlQuery,
                //   sqlQueryData
                // )}
                hidden={customMessage.type !== "warning"}
                className="rounded-[2px]"
              >
                Yes
              </Button>
              <Button
                onClick={clearData}
                hidden={customMessage.type !== "warning"}
                className="rounded-[2px]"
              >
                No
              </Button>
            </Fragment>
          ) : (
            <Fragment>
              <Button onClick={clearData} className="rounded-[2px]">
                Back
              </Button>
              <Button
                onClick={async () => {
                  if (indicatorName === "") {
                    await messageApi.open({
                      type: "error",
                      content: "Please enter an indicator name",
                    });
                  } else {
                    setIsLoading(true);
                    const message = await saveIndicator({
                      indicatorName,
                      analysisGoal,
                      visualizationChoice,
                      sqlQuery,
                    });
                    await messageApi.open({
                      type: message.type,
                      content: message.content,
                    });
                    message.type === "error"
                      ? setIsLoading(false)
                      : await clearData();
                  }
                }}
                loading={isLoading}
                type="primary"
                className="rounded-[2px]"
              >
                Save
              </Button>
            </Fragment>
          )}
        </div>
      </div>
    </Fragment>
  );
};

export default CustomAnalyticalIndicatorSecondary;
