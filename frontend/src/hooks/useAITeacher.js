import { create } from 'zustand';
import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/api_routes';

export const teachers = ["Ava", "Naoki"];

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  isPlaying: false,
  avatarState: 'idle', // State to manage avatar animation
  isComplete: false, // New boolean variable
  learningLevel12: "beginner", // New string variable
  setTeacher: (teacher) => {
    set(() => ({
      teacher,
      messages: get().messages.map((message) => {
        message.audioPlayer = null;
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
  setLearningLevel: (level) => {
    set(() => ({
      learningLevel12: level, // Update learningLevel12
    }));
  },
  setIsComplete: (completeStatus) => {
    set(() => ({
      isComplete: completeStatus, // Update isComplete
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

  playLecturePart: async (text) => {
    const message = {
      id: get().messages.length,
      answer: text,
    };
    await get().playMessage(message);
    set({ isPlaying: true, avatarState: 'talking' });
  },

  pauseLecture: () => {
    const currentMessage = get().currentMessage;
    if (currentMessage && currentMessage.audioPlayer) {
      currentMessage.audioPlayer.pause();
      set({ isPlaying: false, avatarState: 'idle' });
    }
  },

  stopLecture: () => {
    const currentMessage = get().currentMessage;
    if (currentMessage && currentMessage.audioPlayer) {
      currentMessage.audioPlayer.pause();
      currentMessage.audioPlayer.currentTime = 0; // Reset the audio
    }
    set({
      isPlaying: false,
      avatarState: 'idle',
      currentMessage: null, // Clear the current message
    });
  },

  resumeLecture: () => {
    const currentMessage = get().currentMessage;
    if (currentMessage && currentMessage.audioPlayer) {
      currentMessage.audioPlayer.play();
      set({ isPlaying: true, avatarState: 'talking' });
    }
  },

  playMessage: async (message) => {
    set(() => ({
      currentMessage: message,
      avatarState: 'talking',
    }));

    if (!message.audioPlayer) {
      set(() => ({
        loading: true,
      }));
      try {
        const audioRes = await axiosInstance.post(API_URLS.LectureTTS, {
          teacher: get().teacher,
          text: message.answer
        }, {
          responseType: 'json',
        });

        const data = audioRes.data;
        const audioBase64 = data.data.audioBase64;
        const visemes = data.data.visemes;

        const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
        const audioPlayer = new Audio(audioUrl);

        message.visemes = visemes;
        message.audioPlayer = audioPlayer;
        message.audioPlayer.onended = () => {
          set(() => ({
            currentMessage: null,
            isPlaying: false,
            avatarState: 'idle',
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
      } catch (error) {
        console.error('Error fetching audio data:', error);
        set(() => ({
          loading: false,
        }));
      }
    }

    message.audioPlayer.currentTime = 0;
    message.audioPlayer.play();
    set({ isPlaying: true, avatarState: 'talking' });
  },
}));
