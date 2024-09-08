import { Modal, Form, Select, Button } from "antd";
import { useState } from "react";

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

const GenerateTutorialModal = ({
  visible,
  onCancel,
  onSubmit,
  options,
}: {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: { learningLevel: string }) => void;
  options: ["beginner" | "intermediate" | "advanced"];
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

export default GenerateTutorialModal;
