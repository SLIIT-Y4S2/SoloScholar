import { Button, Layout, Progress, Select, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Breadcrumb } from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { ItemType } from "antd/es/breadcrumb/Breadcrumb";

const Tutorial = () => {
  const { module, lesson } = useParams();
  const navigate = useNavigate();

  const [difficulty, setDifficulty] = useState();

  const [generatingNewTutorial, setGeneratingNewTutorial] = useState(false);

  // TODO: fetch past tutorials
  const [pastTutorials, setPastTutorials] = useState([
    {
      key: 1,
      difficulty: "Beginner",
      date: "2021-10-10 17:00",
      status: "Completed", // generating, completed, in progress
      score: 80,
    },
    {
      key: 2,
      difficulty: "Intermediate",
      date: "2021-10-10 17:00",
      status: "Completed",
      score: 90,
    },
    {
      key: 3,
      difficulty: "Advanced",
      date: "2021-10-10 17:00",
      status: "Completed",
      score: 100,
    },
  ]);

  if (generatingNewTutorial) {
    return <Loading />;
  }

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
        <div className="flex items-center gap-2">
          <p>Select Learning Level</p>
          <Select
            value={difficulty}
            onChange={setDifficulty}
            placeholder="Select"
          >
            <Select.Option value="beginner">Beginner</Select.Option>
            <Select.Option value="intermediate">Intermediate</Select.Option>
            <Select.Option value="advanced">Advanced</Select.Option>
          </Select>
        </div>
        <div className="flex justify-end">
          <Button
            type="primary"
            onClick={() => {
              setGeneratingNewTutorial(true);

              setTimeout(() => {
                setGeneratingNewTutorial(false);
                navigate(`./123`);
              }, 2000);
            }}
          >
            Generate Tutorial
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold">Generated Tutorials</h2>
          <Table
            dataSource={pastTutorials}
            pagination={false}
            className="max-w-4xl "
          >
            <Table.Column title="Difficulty" dataIndex="difficulty" />
            <Table.Column title="Created" dataIndex="date" />
            <Table.Column title="Score" dataIndex="score" />
            <Table.Column title="Status" dataIndex="status" />
            <Table.Column
              title="Action"
              render={() => (
                <Button type="primary" onClick={() => {}}>
                  View
                </Button>
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

  const items = pathSnippets.map((_, index) => {
    const path = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    const title =
      pathSnippets[index].charAt(0).toUpperCase() +
      pathSnippets[index].slice(1).replace(/-/g, " ");
    return { path, title };
  });

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

const Loading = () => {
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
