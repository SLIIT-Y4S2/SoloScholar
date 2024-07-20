import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import { useContext, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import {
  VisualizationChoice,
  visualizationChoices,
} from "../../utils/data_visualization_choices";
import {
  Layout,
  Typography,
  Input,
  Select,
  Button,
  Skeleton,
  message,
} from "antd";

const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

const CustomAnalyticalIndicatorPrimary = () => {
  const { createIndicator } = useContext(DashboardContext);
  const [messageApi, contextHolder] = message.useMessage();
  const [analysisGoal, setAnalysisGoal] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visualizationChoice, setVisualizationChoice] =
    useState<VisualizationChoice>(visualizationChoices[0]);

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
        {isLoading ? (
          <Skeleton active />
        ) : (
          <Fragment>
            <div className="grid gap-[58px]">
              <div className="flex gap-[41px] h-fit">
                <Text className="font-medium text-[16px]">Analysis Goal</Text>
                <TextArea
                  required={true}
                  className="font-normal text-[14px] rounded-[5px] resize-none"
                  autoSize={{ minRows: 3 }}
                  placeholder="Enter your analysis goal here...
E.g. I want to see how many beginner level students have scored more than average for each tutorial"
                  value={analysisGoal}
                  onChange={(e: any) => setAnalysisGoal(e.target.value)}
                />
              </div>
              <div className="flex">
                <Text className="font-medium text-[16px]">
                  Visualization Choice
                </Text>
                <Select
                  className="w-full"
                  showSearch
                  onChange={(e: string) =>
                    setVisualizationChoice(
                      visualizationChoices.find(
                        (visualizationChoice) => visualizationChoice.value === e
                      )!
                    )
                  }
                  defaultValue={visualizationChoices[0].value}
                  options={visualizationChoices}
                />
              </div>
              <div className="flex gap-[70px]">
                <Text className="font-medium text-[16px] w-[66px]">
                  Preview
                </Text>
                {visualizationChoice.visualization}
              </div>
            </div>
            <br />
            <div className="flex justify-end">
              <Button
                type="primary"
                className="rounded-[2px]"
                onClick={() => {
                  analysisGoal === ""
                    ? messageApi.open({
                        type: "error",
                        content: "Please enter an analysis goal",
                      })
                    : setIsLoading(true);
                  createIndicator(analysisGoal, visualizationChoice.value);
                }}
              >
                Generate
              </Button>
            </div>
          </Fragment>
        )}
      </Content>
    </Fragment>
  );
};

export default CustomAnalyticalIndicatorPrimary;