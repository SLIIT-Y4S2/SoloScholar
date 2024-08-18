import { Button, Form, Layout, Modal, Select, Skeleton, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance";
import { API_URLS } from "../../../../utils/api_routes";
import { AxiosError, AxiosResponse } from "axios";
import { Tutorial } from "../../../../provider/tutorial/TutorialContext";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import Error from "../../../../Components/Error";
import GeneratingView from "../../../../Components/tutorial/GeneratingView";

const TutorialView = () => {
  const { module, lesson } = useParams<{ module: string; lesson: string }>();
  const navigate = useNavigate();

  const [generatingNewTutorial, setGeneratingNewTutorial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [pastTutorials, setPastTutorials] = useState<Tutorial[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!module || !lesson) return;

    const fetchTutorials = async () => {
      try {
        const response: AxiosResponse<{ data: Tutorial[] }> =
          await axiosInstance.get(API_URLS.TUTORIAL, {
            params: {
              moduleName: module.replace(/-/g, " "),
              lessonTitle: lesson.replace(/-/g, " "),
            },
          });
        const tutorials = response.data.data;
        setPastTutorials(tutorials);

        const allLearningLevels: ("beginner" | "intermediate" | "advanced")[] =
          ["beginner", "intermediate", "advanced"];

        const done = tutorials.map((tutorial) => tutorial.learning_level);
        const remaining = allLearningLevels.filter(
          (level) => !done.includes(level)
        );
        setOptions(remaining);
      } catch (error) {
        handleError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchTutorials();
  }, [lesson, module]);

  const handleError = (error: AxiosError) => {
    const data = error.response?.data as { message?: string };
    setError(
      data?.message || "An error occurred while fetching past tutorials."
    );
  };

  const generateTutorial = async ({
    learningLevel,
  }: {
    learningLevel: string;
  }) => {
    if (!module || !lesson) return;

    try {
      setGeneratingNewTutorial(true);
      const response = await axiosInstance.post(API_URLS.TUTORIAL, {
        moduleName: module.replace(/-/g, " "),
        lessonTitle: lesson.replace(/-/g, " "),
        learningLevel,
      });
      const tutorialId = response.data.data.id;
      navigate(`./${tutorialId}`);
    } catch (error) {
      console.error("Error generating tutorial:", error);
      setError("Failed to generate tutorial. Please try again.");
    } finally {
      setGeneratingNewTutorial(false);
    }
  };

  if (loading) return <TutorialLoading />;
  if (error) return <Error title="Error occurred" subTitle={error} />;
  if (generatingNewTutorial) return <GeneratingView />;

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <CustomBreadcrumb />
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: "#fff",
          borderRadius: "15px",
        }}
        className="flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">Tutorial</h1>
        <p>
          Velit aute reprehenderit fugiat occaecat sit aute amet labore laboris
          occaecat deserunt officia. Aute anim ad aliquip minim eu dolore esse
          non qui anim. Anim nulla in id eu aute nisi ex laborum ex nulla ea
          aliquip do. Ex tempor do do labore est deserunt sunt cillum magna in
          sunt dolor aliquip officia. Pariatur proident pariatur duis aliquip
          exercitation ea anim aute duis ullamco magna fugiat incididunt mollit.
          Cillum sit aute commodo occaecat proident laboris commodo. Mollit sit
          voluptate exercitation adipisicing. Ipsum in quis Lorem in nostrud
          ipsum. Amet tempor sit enim adipisicing esse esse. Labore qui Lorem
          deserunt consectetur reprehenderit eu consectetur laboris labore nulla
          nulla id ullamco nulla. Nulla officia irure voluptate exercitation
          aute. Aute do cillum et labore. Esse aliquip est irure proident
          laborum sit eiusmod dolor qui officia mollit nisi. Reprehenderit irure
          nisi nisi laborum laborum ex duis. Reprehenderit sit amet ut anim
          laboris eu non sint sunt adipisicing exercitation sunt magna do.
        </p>
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={() => setIsModalVisible(true)}
            disabled={options.length === 0}
          >
            Generate New Tutorial
          </Button>
        </div>
        <PastTutorialsTable pastTutorials={pastTutorials} />
      </Content>
      <GenerateTutorialModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={generateTutorial}
        options={options}
      />
    </Layout>
  );
};

const GenerateTutorialModal = ({
  visible,
  onCancel,
  onSubmit,
  options,
}: {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { learningLevel: string }) => void;
  options: string[];
}) => (
  <Modal
    title="Generate New Tutorial"
    open={visible}
    onCancel={onCancel}
    footer={null}
  >
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        name="learningLevel"
        label="Select Learning Level"
        rules={[{ required: true, message: "Please select a learning level" }]}
      >
        <Select
          placeholder="Select"
          options={options.map((option) => ({
            value: option,
            label: option.charAt(0).toUpperCase() + option.slice(1),
          }))}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Generate Tutorial
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

const PastTutorialsTable = ({
  pastTutorials,
}: {
  pastTutorials: Tutorial[];
}) => (
  <div className="flex flex-col gap-4 overflow-x-auto">
    <h2 className="text-xl font-bold">Generated Tutorials</h2>
    <Table
      dataSource={pastTutorials}
      pagination={false}
      className="max-w-4xl"
      rowKey="id"
    >
      <Table.Column
        title="Created"
        dataIndex="created_at"
        render={(text) => formatDate(new Date(text))}
      />
      <Table.Column
        title="Learning Level"
        dataIndex="learning_level"
        render={(text) => text.charAt(0).toUpperCase() + text.slice(1)}
      />
      <Table.Column title="Status" dataIndex="status" />
      <Table.Column
        title="Action"
        dataIndex="id"
        render={(id: string, record: Tutorial) =>
          // record.status !== "generating" &&
          record.status !== "feedback-generating" && (
            <Link to={`./${id}`}>
              <Button type="primary">View</Button>
            </Link>
          )
        }
      />
    </Table>
  </div>
);

const formatDate = (date: Date) => {
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${
    date.getFullYear() % 100
  }`;
  const formattedTime = `${date.getHours()}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
  return `${formattedDate} ${formattedTime}`;
};

export default TutorialView;

function TutorialLoading() {
  const active = true;
  const size = "default";

  const emptyLabSheetSummary = Array.from({ length: 5 }, (_k, id) => ({
    Created: "",
    "Learning Level": "",
    Status: "",
    Action: id,
  }));

  const columns = Object.keys(emptyLabSheetSummary[0]).map((k, i) => {
    return {
      title: k,
      index: k,
      key: i,
    };
  });

  return (
    <Content className="bg-white py-6 px-6 rounded-2xl flex flex-col gap-4">
      <Skeleton paragraph={{ rows: 4 }} active={active} />
      <div className="flex flex-row justify-between gap-2">
        <Skeleton.Input active={active} size={size} />
        <Skeleton.Input active={active} size={size} />
      </div>

      <Table
        dataSource={[]}
        pagination={false}
        className="max-w-4xl "
        rowKey="_id"
        columns={columns}
        locale={{
          emptyText: emptyLabSheetSummary.map((empty) => (
            <Skeleton.Input
              key={empty.Action}
              style={{ marginTop: "10px", width: "100%" }}
              active={true}
              block={true}
            />
          )),
        }}
      />
    </Content>
  );
}
