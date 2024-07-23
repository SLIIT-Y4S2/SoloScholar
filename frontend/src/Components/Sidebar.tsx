import {
  Collapse,
  CollapseProps,
  Layout,
  Space,
  Dropdown,
  Button,
  MenuProps,
} from "antd";
import { useModuleContext } from "../provider/ModuleContext";
import { DownOutlined } from "@ant-design/icons";

interface AntDropdownEvent {
  key: string;
  keyPath: string[];
  /** @deprecated This will not support in future. You should avoid to use this */
  item: React.ReactInstance;
  domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
}

const { Sider } = Layout;

//Todo:  Add this to data folder or fetch from db
const LEARNING_LEVELS = [
  {
    key: 1,
    label: "Beginner",
  },
  {
    key: 2,
    label: "Intermediate",
  },
  {
    key: 3,
    label: "Advanced",
  },
];

export default function Sidebar() {
  const {
    learningLevel,
    setLearningLevel,
    moduleName,
    moduleCode,
    lessonOutline,
    setLabTopic,
  } = useModuleContext();

  const menuProps: MenuProps = {
    items: LEARNING_LEVELS,
    onClick: selectLearningLevel,
  };

  function selectLearningLevel(e: AntDropdownEvent) {
    const newLearningLevel = LEARNING_LEVELS?.find(
      (level) => level?.key === Number(e.key)
    );
    setLearningLevel(newLearningLevel!.label);

    console.log(e);
  }

  const items: CollapseProps["items"] = [
    {
      key: "3",
      label: "Labs",
      children: (
        <div className="flex flex-col items-start justify-start">
          {lessonOutline.map((lesson) => {
            return (
              <Button
                key={lesson.lessonTitle.length}
                className="max-w-[320px] hover:bg-slate-300 w-full p-2 rounded-md text-start border-none my-1"
                onClick={() => setLabTopic(lesson.lessonTitle)}
              >
                {lesson.lessonTitle}
              </Button>
            );
          })}
        </div>
      ),
    },
  ];

  return (
    <Sider
      className="bg-white sticky top-0 flex flex-col gap-4 h-full pt-20 px-8 shadow-2xl overflow-y-auto"
      theme="light"
      width={420}
    >
      <h1 className="font-medium text-lg">{moduleCode}</h1>
      <h1 className="font-bold py-2 text-2xl">{moduleName}</h1>
      <Space className="px-4 py-2 w-full max-w-[380px] justify-between">
        Learning Level
        <Dropdown menu={menuProps}>
          <Button>
            <Space>
              {learningLevel}
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Space>
      <button className="w-full px-4 py-2 hover:bg-slate-300 rounded-md text-start">
        Learning Outcomes
      </button>
      <Collapse
        items={items}
        className="w-full max-w-[380px]"
        size="middle"
        ghost={true}
        expandIconPosition="end"
      />
    </Sider>
  );
}
