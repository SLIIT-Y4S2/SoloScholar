import { Button, Form, Layout, Modal, Select, Skeleton, Table } from "antd";
import { Content } from "antd/es/layout/layout";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../../../utils/axiosInstance";
import { API_URLS } from "../../../../utils/api_routes";
import { AxiosError, AxiosResponse } from "axios";
import { Lecture } from "../../../../provider/lecture/LectureContext";
import CustomBreadcrumb from "../../../../Components/CustomBreadcrumb";
import Error from "../../../../Components/Error";
import GeneratingView from "../../../../Components/lecture/GeneratingView";

// @ts-ignore
import { useAITeacher } from "../../../../hooks/useAITeacher";


const learningLevelDetails = {
  beginner: {
    title: "Beginner Level",
    borderColor: "border-green-500",
    textColor: "text-green-500",

    points: [
      "You're just starting or need a review of the basics.",
      "Focus on learning basic ideas and terms.",
      "Expect simple questions to build a strong foundation.",
    ],
  },
  intermediate: {
    title: "Intermediate Level",
    borderColor: "border-blue-500",
    textColor: "text-blue-500",
    points: [
      "You know the basics and are ready to learn more.",
      "Apply your knowledge to solve problems.",
      "Expect a mix of fact-based and problem-solving questions.",
    ],
  },
  advanced: {
    title: "Advanced Level",
    borderColor: "border-red-500",
    textColor: "text-red-500",
    points: [
      "You have a strong understanding and want to go deeper.",
      "Dive into complex ideas and explore new ones.",
      "Expect tough questions that test your knowledge and skills.",
    ],
  },
};

const LectureView = () => {
  const { module, lesson } = useParams<{ module: string; lesson: string }>();
  const navigate = useNavigate();

  const [generatingNewLecture, setGeneratingNewLecture] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();
  const [pastLectures, setPastLectures] = useState<Lecture[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [options, setOptions] = useState<string[]>([]);

  useEffect(() => {
    if (!module || !lesson) return;

    const fetchLectures = async () => {
      try {
        const response: AxiosResponse<{ data: Lecture[] }> =
          await axiosInstance.get(API_URLS.Lecture, {
            params: {
              moduleName: module.replace(/-/g, " "),
              lessonTitle: lesson.replace(/-/g, " "),
            },
          });
        const lectures = response.data.data;
        setPastLectures(lectures);

        const allLearningLevels: ("beginner" | "intermediate" | "advanced")[] =
          ["beginner", "intermediate", "advanced"];

        const done = lectures.map((lecture) => lecture.learning_level);
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

    fetchLectures();
  }, [lesson, module]);

  const handleError = (error: AxiosError) => {
    const data = error.response?.data as { message?: string };
    setError(
      data?.message || "An error occurred while fetching past lectures."
    );
  };

  const generateLecture = async ({
    learningLevel,
  }: {
    learningLevel: string;
  }) => {
    if (!module || !lesson) return;

    try {
      setGeneratingNewLecture(true);
      const response = await axiosInstance.post(API_URLS.LectureGenerate, {
        moduleName: module.replace(/-/g, " "),
        lessonTitle: lesson.replace(/-/g, " "),
        learningLevel,
      });
      const lectureId = response.data.id;
      //navigate(`./${lectureId}`);
      navigate(`./`);
      window.location.reload(); 
    } catch (error) {
      console.error("Error generating lecture:", error);
      setError("Failed to generate lecture. Please try again.");
    } finally {
      setGeneratingNewLecture(false);
      console.log("Generating new lecture",generatingNewLecture);
    }
  };

  if (loading) return <LectureLoading />;
  if (error) return <Error title="Error occurred" subTitle={error} />;
  if (generatingNewLecture) return <GeneratingView />;

  return (
    <Layout className="container mx-auto mt-3">
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
            <span className="text-gray-700"> Lecture for </span>
            {toProperString(lesson ?? "")}
          </h1>

          <div
            className="bg-gray-100
          rounded-xl p-4"
          >
            <section className="mb-2">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                How the Lecture Works
              </h2>
              <ol className="space-y-3 list-decimal list-inside text-gray-600">
                <li>
                  <strong>Lecture Presentation:</strong> You'll be presented
                  with Lecture content tailored to your learning level and the
                  lesson's objectives. And you have some Pre-Assestments and Post-assessments to test your understanding.
                </li>
                <li>
                  <strong>View Lecture through 3D classromm</strong> You can view the lecture through 3D classroom with 3d avatar.
                </li>
                <li>
                  <strong>Answering Pre-Assestment Questions:</strong> Here you will receive pre-assessment questions to test your knowledge before entering the lecture content. If you don't know the answers, please don't be afraid to select 'Don't know.
                </li>
                <li>
                  <strong>Answering Post-assessment Questions:</strong> Here you will receive post-assessment questions to test your knowledge after lecture is done.
                </li>
                
              </ol>
            </section>

            <section className="mb-2">
              <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                Disclaimer
              </h2>
              <ul className="space-y-1 list-disc list-inside text-gray-600">
                <li>
                  This Lecture uses AI to generate Lectures. While we strive for accuracy, please be aware that AI-generated content may occasionally contain errors.
                </li>
                <li>
                  The Lecture is designed to supplement your learning. Always
                  refer to your official course materials and instructors for
                  authoritative information.
                </li>
                <li>
                  Your interactions within this Lecture are for self-Learning and
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
            Generate New Lecture
          </Button>
        </div>
        <PastLecturesTable pastLectures={pastLectures} />
      </Content>
      <GenerateLectureModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={generateLecture}
        options={options}
      />
    </Layout>
  );
};

const GenerateLectureModal = ({
  visible,
  onCancel,
  onSubmit,
  options,
}: {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { learningLevel: string }) => void;
  options: string[];
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);

  const handleLevelChange = (value: string) => {
    setSelectedLevel(value);
  };

  return (
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
          rules={[
            { required: true, message: "Please select a learning level" },
          ]}
        >
          <Select
            placeholder="Select"
            onChange={handleLevelChange}
            options={options.map((option) => ({
              value: option,
              label: option.charAt(0).toUpperCase() + option.slice(1),
            }))}
          />
        </Form.Item>

        {/* Show the full description for the selected learning level */}
        {selectedLevel && (
          <div
            className={`border-l-4 pl-4 mb-4 ${
              learningLevelDetails[
                selectedLevel as keyof typeof learningLevelDetails
              ].borderColor
            }`}
          >
            <h2
              className={`text-xl font-semibold ${
                learningLevelDetails[
                  selectedLevel as keyof typeof learningLevelDetails
                ].textColor
              }`}
            >
              {
                learningLevelDetails[
                  selectedLevel as keyof typeof learningLevelDetails
                ].title
              }
            </h2>
            <ul className="list-disc list-inside text-gray-700">
              {learningLevelDetails[
                selectedLevel as keyof typeof learningLevelDetails
              ].points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Generate Tutorial
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};
const PastLecturesTable = ({ pastLectures }: { pastLectures: Lecture[] }) => {
  const navigate = useNavigate();

  const handleViewClick = (id: string, learningLevel: string) => {
    navigate(`./${id}`, { state: { learningLevel } });
    

    const { setLearningLevel } = useAITeacher();
    setLearningLevel(learningLevel);
  };

  return (
    <div className="flex flex-col gap-4 overflow-x-auto">
      <h2 className="text-xl font-bold">Generated Lectures</h2>
      <Table
        dataSource={pastLectures}
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
          render={(id: string, record: Lecture) =>
            (record.status as "feedback-generating" | "completed" | "pending") !== "feedback-generating" && (
              <Button
                type="primary"
                onClick={() => handleViewClick(id, record.learning_level)}
              >
                View
              </Button>
            )
          }
        />
      </Table>
    </div>
  );
};

const formatDate = (date: Date) => {
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${
    date.getFullYear() % 100
  }`;
  const formattedTime = `${date.getHours()}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
  return `${formattedDate} ${formattedTime}`;
};

export default LectureView;

function LectureLoading() {
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