import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";
import { Layout, Typography, Input, Button, Result, message } from "antd";
import { useContext, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import { visualizationChoices } from "../../utils/data_visualization_choices";

const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

const CustomAnalyticalIndicatorSecondary = (props: {
  analysisGoal?: string;
  visualizationChoice?: string;
  errorMessage?: string;
}) => {
  const { analysisGoal, visualizationChoice, errorMessage } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const { clearData } = useContext(DashboardContext);
  const [indicatorName, setIndicatorName] = useState<string>("");

  return (
    <Fragment>
      {contextHolder}
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Custom Analytical Indicator" }}
      />
      <Content
        className="
        pt-[69px] pr-[54px] pb-[69px] pl-[54px]
        mt-[35px] mr-[80px] mb-[68px] ml-[45px]
        min-h-[280px] bg-[#ffff] rounded-[15px]
        "
      >
        {errorMessage ? (
          <Result status="error" title={errorMessage} />
        ) : (
          <div className="grid gap-[58px]">
            <div className="flex gap-[29px] h-fit">
              <Text className="font-medium text-[16px] w-[14%]">
                Indicator Name
              </Text>
              <Input
                className="h-[42px]"
                value={indicatorName}
                onChange={(e: string) => setIndicatorName(e)}
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
            {
              visualizationChoices.find(
                (choice) => choice.value === visualizationChoice
              )?.visualization
            }
          </div>
        )}
        <div className="flex justify-end gap-[8px]">
          {errorMessage ? (
            <Button className="rounded-[2px]" onClick={clearData}>
              Retry
            </Button>
          ) : (
            <Fragment>
              <Button className="rounded-[2px]" onClick={clearData}>
                Back
              </Button>
              <Button
                type="primary"
                className="rounded-[2px]"
                onClick={
                  indicatorName === ""
                    ? messageApi.open({
                        type: "error",
                        content: "Please enter an analysis goal",
                      })
                    : ""
                }
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
