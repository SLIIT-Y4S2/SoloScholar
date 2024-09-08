import BreadCrumb from "../../Components/BreadCrumb";
import { Fragment } from "react/jsx-runtime";
import { useEffect, useState } from "react";
import { useDashboardContext } from "../../provider/DashboardContext";
import { getVisualization } from "../../utils/data_visualization_choices";
import { IndicatorState, PreviousIndicator } from "../../types/dashboard.types";
import MyIndicatorDrawer from "../../Components/dashboard/MyIndicatorDrawer";
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
  Modal,
  Button,
  message,
  Skeleton,
} from "antd";

const { Text } = Typography;

// Hold the previous values of the indicator before being edited
let previousIndicator: PreviousIndicator;

const MyIndicators = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [searchText, setSearchText] = useState<string>("");
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isSkeletonLoading, setIsSkeletonLoading] = useState<boolean>(true);
  const [indicatorState, setIndicatorState] = useState<IndicatorState | null>(
    null
  );
  const {
    contextIndicators,
    getIndicators,
    getIndicatorData,
    deleteIndicator,
  } = useDashboardContext();

  useEffect(() => {
    (async () => {
      await getIndicators();
      setIsSkeletonLoading(false);
    })();
  }, []);

  return (
    <Fragment>
      {contextHolder}
      <BreadCrumb sidebarOption={{ label: "My Indicators" }} />
      <div className="mt-[20px] mr-[80px] ml-[45px]">
        <Input
          onChange={(e: any) => setSearchText(e.target.value)}
          value={searchText}
          placeholder="Search your indicator name here..."
        />
      </div>
      <div
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
                      const data: {
                        sqlQueryData: any[];
                        formattedData: any[];
                      } = await getIndicatorData(
                        indicator.id,
                        indicator.visualization_choice
                      );
                      Modal.info({
                        title: <Text>{indicator.indicator_name}</Text>,
                        content:
                          Object.keys(data.sqlQueryData[0]).length > 2 &&
                          indicator.visualization_choice !== "Table" ? (
                            <Result
                              status="info"
                              title={`Sorry, this data cannot be visualized using a
                        ${indicator.visualization_choice.toLowerCase()}.`}
                            />
                          ) : (
                            getVisualization(
                              indicator.visualization_choice,
                              data
                            )
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
                        onClick={async (e: any) => {
                          e.stopPropagation();
                          // Set the previous values of the indicator before being edited
                          previousIndicator = {
                            indicatorName: indicator.indicator_name,
                            analysisGoal: indicator.analysis_goal,
                            visualizationChoice: indicator.visualization_choice,
                          };
                          const data = await getIndicatorData(
                            indicator.id,
                            indicator.visualization_choice
                          );
                          setIndicatorState({
                            id: indicator.id,
                            indicatorName: indicator.indicator_name,
                            analysisGoal: indicator.analysis_goal,
                            visualizationChoice: indicator.visualization_choice,
                            data,
                          });
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
                  {indicatorState && previousIndicator && (
                    <MyIndicatorDrawer
                      isOpen={isDrawerOpen}
                      onClose={() => setIsDrawerOpen(false)}
                      indicatorState={indicatorState}
                      setIndicatorState={setIndicatorState}
                      previousIndicator={previousIndicator}
                      messageApi={messageApi}
                    />
                  )}
                </Fragment>
              ))}
          </div>
        ) : isSkeletonLoading ? (
          <SkeletonCardList />
        ) : (
          <Result status="info" title="You dont' have any indicators" />
        )}
      </div>
    </Fragment>
  );
};

const SkeletonCard = () => (
  <div className="flex flex-col justify-between bg-[#f5f5f5] h-[150px] p-5 mb-6">
    <Skeleton title={true} paragraph={{ rows: 1 }} active />
    <div className="flex justify-end gap-4">
      <Skeleton.Button active size="default" />
      <Skeleton.Button active size="default" />
    </div>
  </div>
);

const SkeletonCardList = ({ count = 2 }) => (
  <Fragment>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </Fragment>
);

export default MyIndicators;
