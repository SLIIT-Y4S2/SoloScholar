import { Button, Layout, Skeleton, Table } from "antd";
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
import GenerateTutorialModal from "../../../../Components/tutorial/GenerateTutorialModal";

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
        const response: AxiosResponse<{
          data: { tutorials: Tutorial[]; allowedLearningLevels: string[] };
        }> = await axiosInstance.get(API_URLS.TUTORIAL, {
          params: {
            moduleName: module.replace(/-/g, " "),
            lessonTitle: lesson.replace(/-/g, " "),
          },
        });
        const result = response.data.data;
        setPastTutorials(result.tutorials);

        // const allLearningLevels: ("beginner" | "intermediate" | "advanced")[] =
        //   ["beginner", "intermediate", "advanced"];

        // const done = tutorials.map((tutorial) => tutorial.learning_level);
        // const remaining = allLearningLevels.filter(
        //   (level) => !done.includes(level)
        // );
        setOptions(result.allowedLearningLevels);
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
      <Layout className="container mx-auto">
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
          <h1 className="text-3xl font-bold">
            <span className="text-gray-700"> Tutorial for </span>
            {toProperString(lesson ?? "")}
          </h1>
          <div
            className="bg-gray-100
          rounded-xl p-4"
          >
            <section className="mb-2">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                How the Tutorial Works
              </h2>
              <ol className="space-y-3 list-decimal list-inside text-gray-600">
                <li>
                  <strong>Question Presentation:</strong> You'll be presented
                  with questions tailored to your learning level and the
                  lesson's objectives. These may include Multiple Choice
                  Questions (MCQs) and short-answer questions.
                </li>
                <li>
                  <strong>Answering Questions:</strong> You can choose which
                  questions to answer. It's not mandatory to answer every
                  question - feel free to skip any that you prefer not to
                  attempt.
                </li>
                <li>
                  <strong>Hints:</strong> If you need assistance, hints are
                  available for each question. These are designed to guide your
                  thinking and provide additional support, but using them is
                  entirely optional.
                </li>
                <li>
                  <strong>Feedback Options:</strong> After submitting your
                  answer, you can choose from three feedback options:
                  <ul className="pl-5 mt-2 space-y-1 list-disc list-inside">
                    <li>
                      Skip feedback (only available if your answer is correct)
                    </li>
                    <li>
                      For more insight, you can request basic feedback, which
                      provides a quick overview of your response.
                    </li>
                    <li>
                      For in-depth learning, you can opt for detailed feedback,
                      which offers comprehensive explanations and additional
                      context.
                    </li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-2">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Disclaimer
              </h2>
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                <li>
                  This tutorial uses AI to generate questions and feedback.
                  While we strive for accuracy, please be aware that
                  AI-generated content may occasionally contain errors.
                </li>
                <li>
                  The tutorial is designed to supplement your learning. Always
                  refer to your official course materials and instructors for
                  authoritative information.
                </li>
                <li>
                  Your interactions within this tutorial are for practice and
                  self-assessment only. They do not constitute formal grading or
                  assessment for your course.
                </li>
              </ul>
            </section>

            <p className="text-sm text-gray-500 mt-6">
              By proceeding, you acknowledge that you understand the nature of
              this AI-assisted tutorial and agree to use it as a supplementary
              learning tool.
            </p>
          </div>
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
      </Layout>
      <GenerateTutorialModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={generateTutorial}
        options={options as ["beginner" | "intermediate" | "advanced"]}
      />
    </Layout>
  );
};

// const GenerateTutorialModal = ({
//   visible,
//   onCancel,
//   onSubmit,
//   options,
// }: {
//   visible: boolean;
//   onCancel: () => void;
//   onSubmit: (values: { learningLevel: string }) => void;
//   options: ["beginner" | "intermediate" | "advanced"];
// }) => (
//   <Modal
//     title="Generate New Tutorial"
//     open={visible}
//     onCancel={onCancel}
//     footer={null}
//   >
//     <Form layout="vertical" onFinish={onSubmit}>
//       <Form.Item
//         name="learningLevel"
//         label="Select Learning Level"
//         rules={[{ required: true, message: "Please select a learning level" }]}
//       >
//         <Select
//           placeholder="Select"
//           options={options.map((option) => ({
//             value: option,
//             label: option.charAt(0).toUpperCase() + option.slice(1),
//           }))}
//         />
//       </Form.Item>

//       {/* show the description for the learning level */}

//       <Form.Item>
//         <Button type="primary" htmlType="submit" block>
//           Generate Tutorial
//         </Button>
//       </Form.Item>
//     </Form>
//   </Modal>
// );

const PastTutorialsTable = ({
  pastTutorials,
}: {
  pastTutorials: Tutorial[];
}) => (
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-bold ">Generated Tutorials</h2>
    <Table
      dataSource={pastTutorials}
      pagination={false}
      className="max-w-4xl"
      scroll={{ x: true }}
      rowKey="id"
    >
      <Table.Column
        title="Created on"
        dataIndex="created_at"
        render={(text) => formatDate(new Date(text))}
      />
      <Table.Column
        title="Learning Level"
        dataIndex="learning_level"
        render={(text) => text.charAt(0).toUpperCase() + text.slice(1)}
      />
      <Table.Column
        title="Status"
        dataIndex="status"
        render={(text) => toProperString(text)}
      />
      <Table.Column
        title="Action"
        dataIndex="id"
        render={(id: string, record: Tutorial) =>
          record.status !== "generating" &&
          record.status !== "feedback-generating" &&
          record.status !== "submitting" && (
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
function toProperString(input: string): string {
  const words = input.split("-");
  words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  return words.join(" ");
}
