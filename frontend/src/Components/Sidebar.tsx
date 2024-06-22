import { Collapse, CollapseProps } from "antd";
import { MODULE_OUTLINE_LESSON_ARRAY } from "../dummyData/lessonOutline";

interface SidebarProps {
  moduleCode: string;
  componentName: string;
}

interface DropdownProps {
  label: string;
  options: string[];
}

//Todo:  Add this to data folder or fetch from db
const LEARNING_LEVEL = {
  label: "Learning Level",
  options: ["Beginner", "Intermediate", "Advanced"],
};

const items: CollapseProps["items"] = [
  {
    key: "1",
    label: "Lectures",
    children: (
      <div className="flex flex-col items-start justify-start">
        {MODULE_OUTLINE_LESSON_ARRAY.map((lesson) => {
          return (
            <button
              key={lesson.lessonTitle.length}
              className="max-w-[320px] hover:bg-slate-300 w-full p-2 rounded-md text-start"
            >
              {lesson.lessonTitle}
            </button>
          );
        })}
      </div>
    ),
  },
  {
    key: "2",
    label: "Tutorial",
    children: (
      <div className="flex flex-col items-start justify-start">
        {MODULE_OUTLINE_LESSON_ARRAY.map((lesson) => {
          return (
            <button
              key={lesson.lessonTitle.length}
              className="max-w-[320px] hover:bg-slate-300 w-full p-2 rounded-md text-start"
            >
              {lesson.lessonTitle}
            </button>
          );
        })}
      </div>
    ),
  },
  {
    key: "3",
    label: "Labs",
    children: (
      <div className="flex flex-col items-start justify-start">
        {MODULE_OUTLINE_LESSON_ARRAY.map((lesson) => {
          return (
            <button
              key={lesson.lessonTitle.length}
              className="max-w-[320px] hover:bg-slate-300 w-full p-2 rounded-md text-start"
            >
              {lesson.lessonTitle}
            </button>
          );
        })}
      </div>
    ),
  },
];

export default function Sidebar({ componentName, moduleCode }: SidebarProps) {
  return (
    <aside className="sticky top-0 flex flex-col w-max max-w-[420px] h-screen pt-20 px-8 bg-slate-100 shadow-2xl shadow-slate-300 gap-4">
      <h1 className="font-medium text-lg">{moduleCode}</h1>
      <h1 className="font-bold my-2 text-2xl">{componentName}</h1>
      <Dropdown {...LEARNING_LEVEL} />
      <button className="w-full py-2 hover:bg-slate-300 rounded-md text-start">
        Learning Outcomes
      </button>
      <Collapse
        items={items}
        className="w-full max-w-[380px]"
        size="middle"
        ghost={true}
        expandIconPosition="right"
      />
    </aside>
  );
}

function Dropdown({ label, options }: DropdownProps) {
  return (
    <div className="flex gap-2 items-center justify-between">
      <p className="w-max">{label}</p>
      <select className="py-2 px-1 w-max border border-gray-300 rounded-md text-center font-roboto">
        {options?.map((option) => (
          <option className="font-roboto" key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
