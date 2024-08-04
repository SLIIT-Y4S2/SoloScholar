import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";
import { Layout, Typography, Input, Button, Result, message } from "antd";
import { useContext, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import { getVisualization } from "../../utils/data_visualization_choices";
import { CustomMessage } from "../../types/dashboard.types";

const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

const CustomAnalyticalIndicatorSecondary = (props: {
  analysisGoal?: string;
  visualizationChoice?: string;
  sqlQuery?: string;
  customMessage?: CustomMessage;
}) => {
  const { analysisGoal, visualizationChoice, sqlQuery, customMessage } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const { saveIndicator, clearData, customMessageIndicator } =
    useContext(DashboardContext);
  const [indicatorName, setIndicatorName] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Fragment>
      {contextHolder}
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Custom Analytical Indicator" }}
      />
      <Content
        className="
        pt-[43px] pr-[46px] pb-[39px] pl-[46px]
        mt-[35px] mr-[80px] mb-[98px] ml-[45px]
        bg-[#ffff] rounded-[15px]
        "
      >
        {customMessage ? (
          <Result status={customMessage?.type} title={customMessage?.content} />
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
                Analysis Goal
              </Text>
              <TextArea
                className="font-normal text-[14px] rounded-[5px] resize-none"
                autoSize={{ minRows: 3 }}
                value={analysisGoal}
              />
            </div>
            <div>
              {
                getVisualization(visualizationChoice)
                // visualizationChoices.find(
                //   (choice) => choice.value === visualizationChoice
                // )?.visualization
              }
            </div>
          </div>
        )}
        <div className="flex justify-end gap-[8px] mt-[50px]">
          {customMessage ? (
            <Button className="rounded-[2px]" onClick={clearData}>
              Retry
            </Button>
          ) : (
            <Fragment>
              <Button className="rounded-[2px]" onClick={clearData}>
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
                    await saveIndicator({
                      indicatorName,
                      analysisGoal,
                      visualizationChoice,
                      sqlQuery,
                      instructorId: "clz0trbf40000ld2w4z43q9yj", // TODO Get instructor id dynamically
                    });
                    await messageApi.open({
                      type: customMessageIndicator?.type,
                      content: customMessageIndicator?.content,
                    });
                    if (customMessageIndicator?.type === "error") {
                      setIsLoading(false);
                    } else {
                      clearData();
                    }
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
      </Content>
    </Fragment>
  );
};

export default CustomAnalyticalIndicatorSecondary;
