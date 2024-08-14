//const { create } = require("zustand");
import { create} from "zustand";

export const teachers = ["Ava", "Naoki"];

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.audioPlayer = null; // New teacher, new Voice
        return message;
      }),
    }));
  },
  classroom: "default",
  setClassroom: (classroom) => {
    set(() => ({
      classroom,
    }));
  },
  loading: false,
  speech: "formal",
  setSpeech: (speech) => {
    set(() => ({
      speech,
    }));
  },
  lectureContent: null,
  subtopics: [],
  currentTopicIndex: 0,


  generateLecture: async (topic) => {
    if (get().lectureContent) {
      // If lecture content is already generated, do not regenerate
      return;
    }
  
    set(() => ({
      loading: true,
    }));
  
    const res = await fetch(`/api/lecture?topic=${topic}&teacher=${get().teacher}`);
    const data = await res.json();
  
    const subtopics = data.lecture.map((item) => item.subtopic);
  
    set(() => ({
      lectureContent: data,
      subtopics: subtopics,
      currentTopicIndex: 0,
      loading: false,
    }));
  
    get().playLecturePart();
  },
  
  playLecturePart: async () => {
    const lectureContent = get().lectureContent;
    const currentTopicIndex = get().currentTopicIndex;
    if (!lectureContent) {
      console.error("Lecture content not generated yet.");
      return;
    }
  
    const subtopic = lectureContent.lecture[currentTopicIndex];
    const message = {
      id: get().messages.length,
      question: subtopic.subtopic,
      answer: subtopic.description,
      audioBase64: subtopic.audioBase64,
      visemes: subtopic.visemes,
    };
  
    get().playMessage(message);
  },
  
  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
    }));
  
    if (!message.audioPlayer && message.audioBase64) {
      set(() => ({
        loading: true,
      }));
  
      const audioUrl = `data:audio/mpeg;base64,${message.audioBase64}`;
      const audioPlayer = new Audio(audioUrl);
  
      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set(() => ({
          currentMessage: null,
        }));
      };
      
      set(() => ({
        loading: false,
        messages: get().messages.map((m) => {
          if (m.id === message.id) {
            return message;
          }
          return m;
        }),
      }));
    }
  
    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
  },
  




  playLecturePart: async () => {
    const lectureContent = get().lectureContent;
    const currentTopicIndex = get().currentTopicIndex;
    if (!lectureContent) {
      console.error("Lecture content not generated yet.");
      return;
    }

    const subtopic = lectureContent.lecture[currentTopicIndex];
    const message = {
      id: get().messages.length,
      question: subtopic.subtopic,
      answer: subtopic.description,
    };
    get().playMessage(message);
  },
  nextTopic: () => {
    set((state) => ({
      currentTopicIndex: state.currentTopicIndex + 1,
    }));
    get().playLecturePart();
  },
  previousTopic: () => {
    set((state) => ({
      currentTopicIndex: state.currentTopicIndex - 1,
    }));
    get().playLecturePart();
  },
  askAI: async (question) => {
    if (!question) {
      return;
    }
    const message = {
      id: get().messages.length,
      question,
    };
    set(() => ({
      loading: true,
    }));

    const speech = get().speech;

    const res = await fetch(`/api/ai?question=${question}&speech=${speech}`);
    const data = await res.json();
    message.answer = data.lecture[0].description;
    message.speech = speech;

    set((state) => ({
      messages: [...state.messages, message],
      loading: false,
    }));
    get().playMessage(message);
  },
  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
    }));

    if (!message.audioPlayer) {
      set(() => ({
        loading: true,
      }));
      const audioRes = await fetch(`/api/tts?teacher=${get().teacher}&text=${encodeURIComponent(message.answer)}`);
      const data = await audioRes.json();
      const audioBase64 = data.audioBase64;
      const visemes = data.visemes;

      const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
      const audioPlayer = new Audio(audioUrl);

      message.visemes = visemes;
      message.audioPlayer = audioPlayer;
      message.audioPlayer.onended = () => {
        set(() => ({
          currentMessage: null,
        }));
      };
      set(() => ({
        loading: false,
        messages: get().messages.map((m) => {
          if (m.id === message.id) {
            return message;
          }
          return m;
        }),
      }));
    }

    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
  },
  stopMessage: (message) => {
    if (message.audioPlayer) {
      message.audioPlayer.pause();
    }
    set(() => ({
      currentMessage: null,
    }));
  },
}));
