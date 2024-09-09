import { useAITeacher } from "../../hooks/useAITeacher";
import { useState, useEffect } from "react";
import { PauseOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { useLectureContext } from "../../provider/lecture/useLectureContext";
import { Button, Typography, Card, Space, Alert } from 'antd';

const { Title, Text } = Typography;

export const TypingBox = () => {
  const playLecturePart = useAITeacher((state) => state.playLecturePart);
  const loading = useAITeacher((state) => state.loading);
  const pauseLecture = useAITeacher((state) => state.pauseLecture);
  const resumeLecture = useAITeacher((state) => state.resumeLecture);
  const stopLecture = useAITeacher((state) => state.stopLecture);
  const isPlaying = useAITeacher((state) => state.isPlaying);
  const currentMessage = useAITeacher((state) => state.currentMessage);

  const [lectureStarted, setLectureStarted] = useState(false);
  const [progressTime, setProgressTime] = useState({ currentTime: 0, duration: 0 });
  const [prevKey, setPrevKey] = useState("");
  const [isGenerating, setIsGenerating] = useState(false); // New state for lecture generation

  const lectureContext = useLectureContext();
  const { lecture, selectedKey } = lectureContext;

  const selectedSubLecture = lecture?.sub_lecture.find(
    (_, index) => `sub${index + 1}` === selectedKey
  );
  const currentContent = selectedSubLecture?.content || "";
  const currentSubLectureTopic = selectedSubLecture?.topic || "Untitled Sub-Lecture";
  const mainLectureTopic = lecture?.learning_material?.lesson?.title || "Untitled Lecture";

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const startLecture = () => {
    if (currentContent) {
      setIsGenerating(true); // Show generating message
      setTimeout(() => {
        playLecturePart(currentContent);
        setLectureStarted(true);
        setIsGenerating(false); // Remove generating message
      }, 2000); // Simulate the lecture generating time
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
        setProgressTime({ currentTime, duration });
      }
    };

    const intervalId = setInterval(updateProgress, 100);
    return () => clearInterval(intervalId);
  }, [currentMessage]);

  useEffect(() => {
    if (prevKey && selectedKey !== prevKey) {
      stopLecture();
      setLectureStarted(false);
      setProgressTime({ currentTime: 0, duration: 0 });
    }

    setPrevKey(selectedKey);
  }, [selectedKey, prevKey, stopLecture]);

  return (
    <div className="z-10 max-w-[600px] flex space-y-6 flex-col bg-gradient-to-tr  from-slate-300/30 via-gray-400/30 to-slate-600-400/30 p-4  backdrop-blur-md rounded-xl border-slate-100/30 border">
      <Space direction="vertical" size="middle" style={{ display: 'flex', alignItems: 'center' }}>
        <Title level={5}>Lecture: {mainLectureTopic}</Title>
        {loading && (
          <Alert message="Wait a few minutes until the lecturer prepares for the lecture." type="info" showIcon />
        )}
        {!loading && (
          <>
            <Space>
              {!lectureStarted ? (
                <Button
                  type="primary"
                  onClick={startLecture}
                  disabled={!currentContent}
                >
                  Start Lecture
                </Button>
              ) : (
                <Button
                  type="primary"
                  icon={isPlaying ? <PauseOutlined /> : <PlayCircleOutlined />}
                  onClick={handlePauseResume}
                >
                  {isPlaying ? 'Pause' : 'Resume'}
                </Button>
              )}
            </Space>

            <Text>
              {formatTime(progressTime.currentTime)} / {formatTime(progressTime.duration)}
            </Text>
          </>
        )}
      </Space>
    </div>
  );
};
