import { Fragment } from "react/jsx-runtime";
import { Layout, Typography, Input, Select, Button } from "antd";
import BreadCrumb from "../../Components/BreadCrumb";
import CustomLineChart from "./visualizations/CustomLineChart";
import { useContext, useState } from "react";
import CustomBarChart from "./visualizations/CustomBarChart";
import CustomPieChart from "./visualizations/CustomPieChart";
import { DashboardContext } from "../../provider/DashboardContext";

const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

interface VisualizationChoice {
  value: string;
  label: JSX.Element;
  visualization: JSX.Element;
}

const visualizationChoices: VisualizationChoice[] = [
  {
    value: "Bar Chart",
    label: <span>Bar Chart</span>,
    visualization: <CustomBarChart />,
  },
  {
    value: "Pie Chart",
    label: <span>Pie Chart</span>,
    visualization: <CustomPieChart />,
  },
  {
    value: "Line Chart",
    label: <span>Line Chart</span>,
    visualization: <CustomLineChart />,
  },
  {
    value: "Dougnout Chart",
    label: <span>Dougnout Chart</span>,
    visualization: <p>saaaaaaaaaa</p>,
  },
];

const CustomAnalyticalIndicator = () => {
  const { createIndicator } = useContext(DashboardContext);
  const [analysisGoal, setAnalysisGoal] = useState<string>("");
  const [visualizationChoice, setVisualizationChoice] =
    useState<VisualizationChoice>(visualizationChoices[0]);

  return (
    <Fragment>
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "Custom Analytical Indicator" }}
      />
      <Content
        className="
      pt-[53px] pr-[45px] pb-[39px] pl-[45px] 
      mt-[35px] mr-[80px] mb-[98px] ml-[47px] 
      bg-[#ffff] 
      rounded-[15px]
      "
      >
        <div className="grid gap-[58px]">
          <div className="flex gap-[41px] h-fit">
            <Text className="font-medium text-[16px]">Analysis Goal</Text>
            <TextArea
              className="font-normal text-[14px] rounded-[5px] resize-none"
              rows={3}
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
            <Text className="font-medium text-[16px] w-[66px]">Preview</Text>
            {visualizationChoice.visualization}
          </div>
        </div>
        <br />
        <div className="flex justify-end">
          <Button
            type="primary"
            className="rounded-[2px]"
            onClick={() => {
              createIndicator(analysisGoal, visualizationChoice.value);
            }}
          >
            Generate
          </Button>
        </div>
      </Content>
    </Fragment>
  );
};

export default CustomAnalyticalIndicator;
