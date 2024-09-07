import getFormattedData from "../utils/data_visualization_formatter";
import { Input, Typography, Button, Select, Drawer, Form } from "antd";
import { Dispatch, SetStateAction, useEffect } from "react";
import { MessageInstance, NoticeType } from "antd/es/message/interface";
import { useDashboardContext } from "../provider/DashboardContext";
import { IndicatorState, PreviousIndicator } from "../types/dashboard.types";
import {
  getVisualization,
  visualizationChoices,
} from "../utils/data_visualization_choices";

const { Text } = Typography;

interface EditIndicatorDrawerProps {
  isOpen: boolean;
  indicatorState: IndicatorState;
  previousIndicator: PreviousIndicator;
  messageApi: MessageInstance;
  onClose: () => void;
  setIndicatorState: Dispatch<SetStateAction<IndicatorState | null>>;
}

const MyIndicatorDrawer = ({
  isOpen,
  onClose,
  indicatorState,
  setIndicatorState,
  previousIndicator,
  messageApi,
}: EditIndicatorDrawerProps) => {
  const [form] = Form.useForm<any>();
  const visualizationChoice = Form.useWatch("visualizationChoice", form);
  const { editIndicator } = useDashboardContext();

  useEffect(() => {
    if (!visualizationChoice || !indicatorState) return;
    const formattedData = getFormattedData(
      indicatorState.data.sqlQueryData,
      visualizationChoice
    );
    setIndicatorState((indicatorState) =>
      indicatorState
        ? { ...indicatorState, data: { ...indicatorState.data, formattedData } }
        : null
    );
  }, [indicatorState.data, visualizationChoice]);

  return (
    <Drawer
      onClose={onClose}
      open={isOpen}
      title="Edit Indicator"
      placement="right"
      size="large"
    >
      <div className="flex flex-col h-full gap-[30px]">
        <Form
          form={form}
          onFinish={async (value) => {
            if (
              value.indicatorName === previousIndicator.indicatorName &&
              value.analysisGoal === previousIndicator.analysisGoal &&
              value.visualizationChoice ===
                previousIndicator.visualizationChoice
            ) {
              messageApi.open({
                type: "info",
                content: "Nothing was updated",
              });
            } else {
              onClose();
              const message = await editIndicator({
                id: indicatorState.id,
                indicatorName: value.indicatorName,
                visualizationChoice: value.visualizationChoice,
              });
              messageApi.open({
                type: message.type as NoticeType,
                content: message.content,
              });
            }
          }}
          className="flex flex-col h-full w-full justify-between"
          layout="vertical"
          onError={(error) => console.log(error)}
          initialValues={{
            indicatorName: indicatorState.indicatorName,
            analysisGoal: indicatorState.analysisGoal,
            visualizationChoice: indicatorState.visualizationChoice,
          }}
        >
          <div>
            <Form.Item
              label={
                <Text>
                  <b>Indicator Name</b>
                </Text>
              }
              rules={[
                {
                  required: true,
                  message: "Please enter an indicator name!",
                },
                {
                  max: 100,
                  message: "Indicator name must not exceed 100 characters!",
                },
              ]}
              name="indicatorName"
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={
                <Text>
                  <b>Analysis Goal</b>
                </Text>
              }
              name="analysisGoal"
            >
              <Input disabled />
            </Form.Item>
            <Form.Item
              label={
                <Text>
                  <b>Visualization Choice</b>
                </Text>
              }
              name="visualizationChoice"
            >
              <Select
                className="w-full"
                showSearch
                options={visualizationChoices}
              />
            </Form.Item>
            {getVisualization(visualizationChoice, indicatorState.data)}
          </div>
          <div className="flex gap-[10px] mt-10">
            <Button htmlType="submit" type="primary">
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </Form>
      </div>
    </Drawer>
  );
};

export default MyIndicatorDrawer;
