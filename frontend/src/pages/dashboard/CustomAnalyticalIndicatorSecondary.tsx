import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";
import { Layout, Typography, Input, Button } from "antd";
import { useContext } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import { visualizationChoices } from "../../utils/data_visualization_choices";

const { Content } = Layout;
const { Text } = Typography;
const { TextArea } = Input;

interface CustomAnalyticalIndicatorSecondaryProps {
  visualizationChoice: string;
}

const CustomAnalyticalIndicatorSecondary = (
  props: CustomAnalyticalIndicatorSecondaryProps
) => {
  const { visualizationChoice } = props;
  const { clearData } = useContext(DashboardContext);

  return (
    <Fragment>
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
        <div className="grid gap-[58px]">
          <div className="flex gap-[29px] h-fit">
            <Text className="font-medium text-[16px] w-[14%]">
              Indicator Name
            </Text>
            <Input className="h-[42px]" />
          </div>
          <div className="flex gap-[29px] h-fit">
            <Text className="font-medium text-[16px] w-[14%]">
              Analysis Goal
            </Text>
            <TextArea
              className="font-normal text-[14px] rounded-[5px] resize-none"
              autoSize={{ minRows: 3 }}
              value={"" /* TODO */}
            />
          </div>
          {
            visualizationChoices.find(
              (choice) => choice.value === visualizationChoice
            )?.visualization
          }
          {/* <CustomBarChart /> */}
          <div className="flex justify-end gap-[8px]">
            <Button className="rounded-[2px]" onClick={clearData}>
              Back
            </Button>
            <Button type="primary" className="rounded-[2px]">
              Save
            </Button>
          </div>
        </div>
      </Content>
    </Fragment>
  );
};

export default CustomAnalyticalIndicatorSecondary;
