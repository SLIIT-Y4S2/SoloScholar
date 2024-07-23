import { Button, Form, Layout, Progress, Select, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";
import axiosInstance from "../../../../utils/axiosInstance";
import { API_URLS } from "../../../../utils/api_routes";
import { AxiosError, AxiosResponse } from "axios";

const Tutorial = () => {
  const { module, lesson } = useParams();
  const navigate = useNavigate();

  const [generatingNewTutorial, setGeneratingNewTutorial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  // TODO: fetch past tutorials
  const [pastTutorials, setPastTutorials] = useState<
    {
      id: string;
      create_at: string;
      status: string;
      learning_level: string;
    }[]
  >();

  useEffect(() => {
    if (!module || !lesson) {
      return;
    }
    axiosInstance
      .get(API_URLS.TUTORIAL, {
        params: {
          moduleName: module.replace(/-/g, " "),
          lessonTitle: lesson.replace(/-/g, " "),
        },
      })
      .then((response: AxiosResponse) => {
        setPastTutorials(response.data.data);
        setLoading(false);
      })
      .catch((error: AxiosError) => {
        console.log("Error fetching past tutorials:");
        const data = error.response?.data;
        if (data && typeof data === "object" && "message" in data) {
          // message.error(data.message);
          setError(data.message as string);
        }
        setLoading(false);
      });
  }, [lesson, module]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (generatingNewTutorial) {
    return <TutorialGenerating />;
  }

  const generateTutorial = async ({
    learningLevel,
  }: {
    learningLevel: string;
  }) => {
    try {
      if (!module || !lesson) {
        return;
      }
      setGeneratingNewTutorial(true);
      const response = await axiosInstance.post(API_URLS.TUTORIAL, {
        moduleName: module.replace(/-/g, " "),
        lessonTitle: lesson.replace(/-/g, " "),
        learningLevel,
      });
      const tutorialId = response.data.data.id;
      navigate(`./${tutorialId}`);
    } catch (error) {
      console.log("Error generating tutorial:", error);
    }
  };

  return (
    <Layout style={{ padding: "0 24px 24px" }}>
      <DynamicBreadcrumbComponent />
      <Content
        style={{
          padding: 24,
          margin: 0,
          minHeight: 280,
          background: "#ffff",
          borderRadius: "15px",
        }}
        className="flex flex-col gap-4"
      >
        <h1 className="text-2xl font-bold">Introduction</h1>
        <p>
          Lorem ipsum dolor sit amet consectetur. Vitae neque dui est elit diam
          risus. Integer nunc risus et elit dictum vitae in lorem sit. Felis
          enim aliq uam sit et eleifend. Ac consectetur porta congue eros velit
          lacinia dui. Commodo eu purus arcu consectetur. Cursus leo tempus
          lacinia nisl vel sus pendisse imperdiet ph. aretra volutpat. Nulla dui
          dui venenatis pulvinar in mi erat. Semper ac mattis curabitur nullam
          sit augue eget id ma ecenas. Commodo feugiat facilisi a purus cursus
          cras amet. Sit tempor vitae adipiscing a purus ac nulla. Bibendum
          pellentesque eget dic tumst justo etiam in fringilla. Iaculis augue at
          venenatis nulla eu donec nisl. Habitasse sem arcu rhoncus gravida
          viverra nibh. Feugiat ut n ibh vitae accumsan id congue viverra.
        </p>
        <Form layout="vertical" onFinish={generateTutorial}>
          <div className="flex flex-row items-center gap-2">
            <div className="mb-6">Select Learning Level</div>
            <Form.Item
              name="learningLevel"
              rules={[
                { required: true, message: "Please select a learning level" },
              ]}
              className="flex flex-col mb-6"
              style={{ minWidth: "130px" }}
            >
              <Select placeholder="Select">
                <Select.Option value="beginner">Beginner</Select.Option>
                <Select.Option value="intermediate">Intermediate</Select.Option>
                <Select.Option value="advanced">Advanced</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <div className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Generate Tutorial
            </Button>
          </div>
        </Form>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Generated Tutorials</h2>
          <Table
            dataSource={pastTutorials}
            pagination={false}
            className="max-w-4xl "
            rowKey="id"
          >
            <Table.Column
              title="Created"
              dataIndex="create_at"
              render={(text) => {
                const date = new Date(text);
                const formattedDate = `${
                  date.getMonth() + 1
                }/${date.getDate()}/${date.getFullYear() % 1000}`;
                const formattedTime = `${date.getHours()}:${String(
                  date.getMinutes()
                ).padStart(2, "0")}`;
                return `${formattedDate} ${formattedTime}`;
              }}
            />
            <Table.Column title="Learning Level" dataIndex="learning_level" />
            {/* <Table.Column title="Score" dataIndex="score" /> */}
            <Table.Column title="Status" dataIndex="status" />
            <Table.Column
              title="Action"
              dataIndex="id"
              render={(id: string) => (
                <Link to={`./${id}`}>
                  <Button type="primary">View</Button>
                </Link>
              )}
            />
          </Table>
        </div>
      </Content>
    </Layout>
  );
};

export default Tutorial;

export const DynamicBreadcrumbComponent = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);

  const items = [
    { path: "/", title: "Modules" },
    ...pathSnippets.map((_, index) => {
      const path = `/${pathSnippets.slice(0, index + 1).join("/")}`;
      const title =
        pathSnippets[index].charAt(0).toUpperCase() +
        pathSnippets[index].slice(1).replace(/-/g, " ");
      return { path, title };
    }),
  ];
  function itemRender(route: ItemType, _: unknown, routes: ItemType[]) {
    const isLast = route?.path === routes[items.length - 1]?.path;

    return isLast ? (
      <span>{route.title}</span>
    ) : (
      <Link to={route.path ?? "/"}>{route.title}</Link>
    );
  }

  return (
    <Breadcrumb
      style={{ margin: "16px 0" }}
      itemRender={itemRender}
      items={items}
    />
  );
};

const TutorialGenerating = () => {
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 1;
      });
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* <Spin size="large" /> */}
      <Progress
        percent={percent}
        status="active"
        showInfo={false}
        className="w-1/2"
      />
      <p>Loading... Please wait for about 2 minutes.</p>
    </div>
  );
};
