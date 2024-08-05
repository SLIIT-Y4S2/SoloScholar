import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getModuleByName } from "../../services/module.service";
import { Module as ModuleType } from "../../types/module.types";

const Module = () => {
  const { module } = useParams();

  const [moduleData, setModuleData] = useState<ModuleType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        if (!module) {
          return;
        }
        const moduleData = await getModuleByName(module.replace("-", " "));
        setModuleData(moduleData);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
        setIsLoading(false);
      }
    };
    fetchModule();
  }, [module]);

  if (isLoading) {
    return <>Loading...</>;
  }

  if (!moduleData) {
    return <>Module not found</>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{moduleData.name}</h1>
      <p className="text-gray-600 mb-8">{moduleData.description}</p>
      <div className="flex flex-col gap-4">
        {moduleData.lessons.map((lesson, index) => (
          <div key={lesson.id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">
              {index + 1}. {lesson.title}
            </h2>
            <p className="text-gray-600 mb-4">{lesson.description}</p>
            <div className="flex space-x-2">
              {["lecture", "tutorial", "lab"].map((type) => {
                const title = lesson.title.toLowerCase().replace(/\s/g, "-");
                const path = `/${module}/${title}/${type}`;
                return (
                  <Link
                    key={type}
                    to={path}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition duration-300"
                  >
                    {type}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Module;
