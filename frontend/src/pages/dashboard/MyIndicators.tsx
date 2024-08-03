import { Fragment } from "react/jsx-runtime";
import BreadCrumb from "../../Components/BreadCrumb";
import { useContext, useEffect, useState } from "react";
import { DashboardContext } from "../../provider/DashboardContext";
import { getVisualization } from "../../utils/data_visualization_choices";
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
} from "antd";

const { Text } = Typography;
const { Content } = Layout;

const MyIndicators = () => {
  const {
    contextIndicators,
    getIndicators,
    getIndicatorData,
    deleteIndicator,
    customMessageIndicator,
  } = useContext(DashboardContext);
  const [searchText, setSearchText] = useState<string>("");
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async (indicatorId: string) => {
    await deleteIndicator(indicatorId);
    await messageApi.open({
      type: customMessageIndicator?.type,
      content: customMessageIndicator?.content,
    });
  };

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
          <div className="grid gap-4">
            {contextIndicators
              .filter((indicator: any) =>
                indicator.indicator_name.toLowerCase().includes(searchText)
              )
              .map((indicator: any) => (
                <Card
                  key={indicator.id}
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
                  <Text className="text-center">{indicator.analysis_goal}</Text>
                  <div className="flex justify-end gap-3">
                    <Button
                      onClick={async (e: any) => {
                        e.stopPropagation();
                      }}
                      icon={<EditOutlined />}
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={(e: any) => {
                        e.stopPropagation();
                        Modal.confirm({
                          onOk: () => {
                            handleDelete(indicator.id);
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
