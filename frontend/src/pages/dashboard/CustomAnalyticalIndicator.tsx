import { Fragment } from "react/jsx-runtime";
import { Layout, Typography, Input, Select, Button } from "antd";
import BreadCrumb from "../../Components/BreadCrumb";
import CustomLineChart from "./visualizations/CustomLineChart";
import { useState } from "react";

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
    visualization: <CustomLineChart />,
  },
  {
    value: "Pie Chart",
    label: <span>Pie Chart</span>,
    visualization: <p>sdsd</p>,
  },
  {
    value: "Line Chart",
    label: <span>Line Chart</span>,
    visualization: <p>aaaaa</p>,
  },
  {
    value: "Dougnout Chart",
    label: <span>Dougnout Chart</span>,
    visualization: <p>saaaaaaaaaa</p>,
  },
];

const CustomAnalyticalIndicator = () => {
  const [visualization, setVisualization] = useState<JSX.Element>(
    visualizationChoices[0].visualization
  );

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
        <div className="grid grid-rows-3 gap-[58px] ">
          <div className="flex gap-[41px]">
            <Text className="font-medium text-[16px] w-fit">Analysis Goal</Text>
            <TextArea
              className="font-normal text-[14px] rounded-[5px] resize-none"
              rows={3}
              placeholder="Enter your analysis goal here...
E.g. I want to see how many beginner level students have scored more than average for each tutorial"
            />
          </div>
          <div className="flex gap-[41px]">
            <Text className="font-medium text-[16px]">
              Visualization <br />
              Choice
            </Text>
            <Select
              showSearch
              onChange={(e: string) =>
                setVisualization(
                  visualizationChoices.find((choice) => choice.value === e)
                    ?.visualization || <></>
                )
              }
              defaultValue={visualizationChoices[0].value}
              options={visualizationChoices}
            />
          </div>
          <div className="flex gap-[41px]">
            <Text className="font-medium text-[16px] w-max">Preview</Text>
            {visualization}
          </div>
        </div>
        <br />
        <div className="flex justify-end">
          <Button type="primary" className="rounded-[2px]">
            Generate
          </Button>
        </div>
      </Content>
    </Fragment>
  );
};

export default CustomAnalyticalIndicator;
