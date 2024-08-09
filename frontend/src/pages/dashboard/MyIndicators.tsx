import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import {
  getVisualization,
  visualizationChoices,
} from "../../utils/data_visualization_choices";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import {
  Typography,
  Card,
  Input,
  Result,
  Layout,
  Modal,
  Button,
  message,
  Select,
  Drawer,
} from "antd";

const { Text } = Typography;
const { Content } = Layout;
const { TextArea } = Input;

// Hold the current values of the indicator before being edited
let currentIndicator: any = {
  id: "",
  indicatorName: "",
  analysisGoal: "",
  visualizationChoice: "",
};

const MyIndicators = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [indicatorState, setIndicatorState] = useState<any>({
    indicatorName: "",
    analysisGoal: "",
    visualizationChoice: null,
  });
  const {
    contextIndicators,
    getIndicators,
    getIndicatorData,
    editIndicator,
    deleteIndicator,
  } = useContext(DashboardContext);

  useEffect(() => {
    (async () => {
      // TODO Make the following dynamic using the data from backend
      await getIndicators("clz0trbf40000ld2w4z43q9yj"); // instructorId = clz0trbf40000ld2w4z43q9yj
    })();
  }, []);

  return (
    <Fragment>
      {contextHolder}
      <BreadCrumb
        module={{ label: "Module A", linkTo: "#" }}
        sidebarOption={{ label: "My Indicators" }}
      />
      <div className="mt-[20px] mr-[80px] ml-[45px]">
        <Input
          onChange={(e: any) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search your indicator name here..."
        />
      </div>
      <Content
        className="
      pt-[43px] pr-[46px] pb-[39px] pl-[46px]
      mt-[35px] mr-[80px] mb-[98px] ml-[45px]
      bg-[#ffff] rounded-[15px]
      "
      >
        {contextIndicators ? (
          <div className="grid gap-6">
            {contextIndicators
              .filter((indicator: any) =>
                indicator.indicator_name.toLowerCase().includes(searchText)
              )
              .map((indicator: any) => (
                <Fragment key={indicator.id}>
                  <Card
                    title={indicator.indicator_name}
                    onClick={async () => {
                      const data = await getIndicatorData(
                        indicator.id,
                        indicator.visualization_choice
                      );
                      Modal.info({
                        title: <Text>{indicator.indicator_name}</Text>,
                        content: getVisualization(
                          indicator.visualization_choice,
                          data
                        ),
                        width: "75%",
                        okText: "Close",
                      });
                    }}
                    bordered={false}
                    hoverable
                    className="bg-[#f5f5f5] hover:bg-[#F6F6F6] transition duration-300"
                  >
                    <Text className="text-center">
                      {indicator.analysis_goal}
                    </Text>
                    <div className="flex justify-end gap-3">
                      <Button
                        onClick={(e: any) => {
                          e.stopPropagation();
                          setIndicatorState({
                            indicatorName: indicator.indicator_name,
                            analysisGoal: indicator.analysis_goal,
                            visualizationChoice: indicator.visualization_choice,
                          });
                          // Set the current values of the indicator before being edited
                          currentIndicator = {
                            ...{
                              id: indicator.id,
                              indicatorName: indicator.indicator_name,
                              analysisGoal: indicator.analysis_goal,
                              visualizationChoice:
                                indicator.visualization_choice,
                            },
                          };
                          setIsDrawerOpen(true);
                        }}
                        icon={<EditOutlined />}
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={(e: any) => {
                          e.stopPropagation();
                          Modal.confirm({
                            onOk: async () => {
                              const message = await deleteIndicator(
                                indicator.id
                              );
                              messageApi.open({
                                type: message.type,
                                content: message.content,
                              });
                            },
                            icon: <ExclamationCircleFilled />,
                            title: <Text>Delete Indicator</Text>,
                            content: (
                              <Text>
                                This will permanently delete your indicator. Are
                                you sure?
                              </Text>
                            ),
                            okText: "Yes",
                            cancelText: "No",
                          });
                        }}
                        icon={<DeleteOutlined />}
                        danger
                      >
                        Delete
                      </Button>
                    </div>
                  </Card>
                  <Drawer
                    onClose={() => {
                      setIsDrawerOpen(false);
                    }}
                    open={isDrawerOpen}
                    title="Edit Indicator"
                    placement="right"
                    size="large"
                  >
                    <div className="flex flex-col h-full gap-[30px]">
                      <div>
                        <Text>
                          <b>Indicator Name</b>
                        </Text>
                        <Input
                          onChange={(e: any) =>
                            setIndicatorState({
                              indicatorName: e.target.value,
                              analysisGoal: indicatorState.analysisGoal,
                              visualizationChoice:
                                indicatorState.visualizationChoice,
                            })
                          }
                          value={indicatorState.indicatorName}
                        />
                      </div>
                      <div>
                        <Text>
                          <b>Analysis Goal</b>
                        </Text>
                        <TextArea
                          onChange={(e: any) =>
                            setIndicatorState({
                              analysisGoal: e.target.value,
                              indicatorName: indicatorState.indicatorName,
                              visualizationChoice:
                                indicatorState.visualizationChoice,
                            })
                          }
                          value={indicatorState.analysisGoal}
                          autoSize={{ minRows: 3 }}
                        />
                      </div>
                      <div>
                        <Text>
                          <b>Visualization Choice</b>
                        </Text>
                        <Select
                          className="w-full"
                          showSearch
                          onChange={(e: string) =>
                            setIndicatorState({
                              visualizationChoice: e,
                              indicatorName: indicatorState.indicatorName,
                              analysisGoal: indicatorState.analysisGoal,
                            })
                          }
                          value={indicatorState.visualizationChoice}
                          options={visualizationChoices.filter(
                            (choice: any) =>
                              choice.value !== indicator.visualization_choice
                          )}
                        />
                      </div>
                      <div>
                        <Text>
                          <b>Preview</b>
                        </Text>
                        {getVisualization(indicatorState.visualizationChoice)}
                      </div>
                      <div className="flex gap-[10px] mt-auto">
                        <Button
                          onClick={async () => {
                            if (
                              indicatorState.indicatorName === "" ||
                              indicatorState.analysisGoal === ""
                            ) {
                              messageApi.open({
                                type: "error",
                                content: "Please fill all the fields",
                              });
                            } else if (
                              indicatorState.indicatorName ===
                                currentIndicator.indicatorName &&
                              indicatorState.analysisGoal ===
                                currentIndicator.analysisGoal &&
                              indicatorState.visualizationChoice ===
                                currentIndicator.visualizationChoice
                            ) {
                              messageApi.open({
                                type: "info",
                                content: "Nothing was updated",
                              });
                            } else {
                              setIsDrawerOpen(false);
                              const message = await editIndicator({
                                id: currentIndicator.id,
                                ...indicatorState,
                              });
                              messageApi.open({
                                type: message.type,
                                content: message.content,
                              });
                            }
                          }}
                          type="primary"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => {
                            setIsDrawerOpen(false);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </Drawer>
                </Fragment>
              ))}
          </div>
        ) : (
          <Result status="info" title="You dont' have any indicators" />
        )}
      </Content>
    </Fragment>
  );
};

export default MyIndicators;
