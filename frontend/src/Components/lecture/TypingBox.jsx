import { useAITeacher } from "../../hooks/useAITeacher";
import { useState, useEffect } from "react";
import {
  PlayCircleOutlined,
  PauseOutlined
} from '@ant-design/icons';
import { useLectureContext } from "../../provider/lecture/useLectureContext";

export const TypingBox = () => {
  const playLecturePart = useAITeacher((state) => state.playLecturePart);
  const pauseLecture = useAITeacher((state) => state.pauseLecture);
  const resumeLecture = useAITeacher((state) => state.resumeLecture);
  const nextTopic = useAITeacher((state) => state.nextTopic);
  const previousTopic = useAITeacher((state) => state.previousTopic);
  const subtopics = useAITeacher((state) => state.subtopics);
  const currentTopicIndex = useAITeacher((state) => state.currentTopicIndex);
  const isPlaying = useAITeacher((state) => state.isPlaying);
  const avatarState = useAITeacher((state) => state.avatarState);
  const currentMessage = useAITeacher((state) => state.currentMessage);

  const [lectureStarted, setLectureStarted] = useState(false);
  const [progress, setProgress] = useState(0);

  const lectureContext = useLectureContext();
  const { lecture, selectedKey , status} = lectureContext;

  // Find the selected sub-lecture content
  const selectedSubLecture = lecture?.sub_lecture.find(
    (_, index) => `sub${index + 1}` === selectedKey
  );

  const currentContent = selectedSubLecture?.content || "";

  //const currentContent = "This is a sample lecture content. please test . good night.";

  //console.log("cc : ",selectedKey);

  const startLecture = () => {
    if (currentContent) {
      playLecturePart(currentContent);
      setLectureStarted(true);
    }
  };

  const handlePauseResume = () => {
    if (isPlaying) {
      pauseLecture();
    } else {
      resumeLecture();
    }
  };

  useEffect(() => {
    const updateProgress = () => {
      if (currentMessage && currentMessage.audioPlayer) {
        const { currentTime, duration } = currentMessage.audioPlayer;
        setProgress((currentTime / duration) * 100);
      }
    };

    const intervalId = setInterval(updateProgress, 100);

    return () => clearInterval(intervalId);
  }, [currentMessage]);

  useEffect(() => {
    // Reset lecture state when selected key changes
    setLectureStarted(false);
    setProgress(0);
  }, [selectedKey]);

  return (
    <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4 backdrop-blur-md rounded-xl border-slate-100/30 border">
      <div>
        <h2 className="text-white font-bold text-xl">{status}</h2>
      </div>

      <div className="gap-3 flex flex-col">
        {!lectureStarted ? (
          <button className="bg-slate-100/20 p-2 px-6 rounded-full text-white flex items-center justify-center" onClick={startLecture} disabled={!currentContent}>
            <PlayCircleOutlined />
            Start Lecture
          </button>
        ) : (
          <button className="bg-slate-100/20 p-2 px-6 rounded-full text-white flex items-center justify-center" onClick={handlePauseResume}>
            {isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
          </button>
        )}
        {subtopics.length > 0 && (
          <div className="flex flex-col items-center">
            <div className="text-white mb-2">
              {subtopics[currentTopicIndex]}
            </div>
            <div className="flex gap-2">
              <button
                className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
                onClick={previousTopic}
                disabled={currentTopicIndex === 0 || !isPlaying}
              >
                Back
              </button>
              <button
                className="bg-slate-100/20 p-2 px-6 rounded-full text-white"
                onClick={nextTopic}
                disabled={currentTopicIndex === subtopics.length - 1 || !isPlaying}
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
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};