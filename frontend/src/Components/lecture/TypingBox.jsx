import { useAITeacher } from "../../hooks/useAITeacher";
import { useState } from "react";

export const TypingBox = () => {
  const askAI = useAITeacher((state) => state.askAI);
  const loading = useAITeacher((state) => state.loading);
  const generateLecture = useAITeacher((state) => state.generateLecture);
  const playLecturePart = useAITeacher((state) => state.playLecturePart);
  const nextTopic = useAITeacher((state) => state.nextTopic);
  const previousTopic = useAITeacher((state) => state.previousTopic);
  const subtopics = useAITeacher((state) => state.subtopics);
  const currentTopicIndex = useAITeacher((state) => state.currentTopicIndex);
  // const [question, setQuestion] = useState("");
  const [topic, setTopic] = useState("photosynthesis");

  // const ask = () => {
  //   askAI(question);
  //   setQuestion("");
  // };

  const startLecture = () => {
    generateLecture(topic);
  };

  return (
    <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">Ask any questions</h2>
        {/* <p className="text-white/65">
          Here you can ask any questions related to covered content. The teacher will answer your question after some time.
        </p> */}
      </div>

      {loading ? (
        <div className="flex justify-center items-center">
          <span className="relative flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
          </span>
        </div>
      ) : (
        <div className="gap-3 flex flex-col">
          {/* <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="type the question here"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                ask();
              }
            }}
          /> */}
          <input
            className="focus:outline focus:outline-white/80 flex-grow bg-slate-800/60 p-2 px-4 rounded-full text-white placeholder:text-white/50 shadow-inner shadow-slate-900/60"
            placeholder="type the topic here"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          
          <button className="bg-slate-100/20 p-2 px-6 rounded-full text-white" onClick={startLecture}>
            Start Lecture
          </button>
          {subtopics.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-white mb-2">
                {subtopics[currentTopicIndex]}
              </div>
              <div className="flex gap-2">
                <button
                  className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
                  onClick={previousTopic}
                  disabled={currentTopicIndex === 0}
                >
                  Back
                </button>
                <button
                  className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
                  onClick={nextTopic}
                  disabled={currentTopicIndex === subtopics.length - 1}
                >
                  Next
                </button>
              </div>
              {currentTopicIndex === subtopics.length - 1 && (
                <div className="text-white mt-2">
                  Lecture Completed
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
