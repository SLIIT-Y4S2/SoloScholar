// //import create from "zustand";
// import { create } from 'zustand';

// import axios from 'axios';


// import axiosInstance from '../utils/axiosInstance';
// import { API_URLS } from '../utils/api_routes';

// export const teachers = ["Ava", "Naoki"];

// export const useAITeacher = create((set, get) => ({
//   messages: [],
//   currentMessage: null,
//   teacher: teachers[0],
//   isPlaying: false,
//   avatarState: 'idle', // New state to manage avatar animation

//   audioBase64: null,
//   visemes: [],
//   loading: false,
//   error: null,
  

//   setTeacher: (teacher) => {
//     set(() => ({
//       teacher,
//       messages: get().messages.map((message) => {
//         message.audioPlayer = null;
//         return message;
//       }),
//     }));
//   },

//   classroom: "default",

//   setClassroom: (classroom) => {
//     set(() => ({
//       classroom,
//     }));
//   },

//   loading: false,
//   speech: "formal",

//   setSpeech: (speech) => {
//     set(() => ({
//       speech,
//     }));
//   },

//   lectureContent: null,
//   subtopics: [],
//   currentTopicIndex: 0,

//   playLecturePart: async (text) => {
//     const message = {
//       id: get().messages.length,
//       answer: text,
//     };
//     await get().playMessage(message);
//     set({ isPlaying: true, avatarState: 'talking' });
//   },

//   pauseLecture: () => {
//     const currentMessage = get().currentMessage;
//     if (currentMessage && currentMessage.audioPlayer) {
//       currentMessage.audioPlayer.pause();
//       set({ isPlaying: false, avatarState: 'idle' });
//     }
//   },

//   resumeLecture: () => {
//     const currentMessage = get().currentMessage;
//     if (currentMessage && currentMessage.audioPlayer) {
//       currentMessage.audioPlayer.play();
//       set({ isPlaying: true, avatarState: 'talking' });
//     }
//   },

//   // nextTopic: () => {
//   //   set((state) => ({
//   //     currentTopicIndex: state.currentTopicIndex + 1,
//   //   }));
//   //   get().playLecturePart();
//   // },

//   // previousTopic: () => {
//   //   set((state) => ({
//   //     currentTopicIndex: state.currentTopicIndex - 1,
//   //   }));
//   //   get().playLecturePart();
//   // },



// //   playMessage: async (message) => {
// //     set(() => ({
// //       currentMessage: message,
// //       avatarState: 'talking',
// //     }));



// //     try {
// //       const response = await axiosInstance.post(API_URLS.LectureTTS, {
// //         teacher: get().teacher,
// //         text: message.answer
// //       }, {
// //         responseType: 'json',
// //       });


// //       console.log('Received TTS data:', response.data);

// // // Check if the response is in the expected format
// // if (!response.data || !response.data.data || !response.data.data.audioBase64 || !response.data.data.visemes) {
// //   throw new Error('Unexpected response format from TTS API');
// // }
// //       const { audioBase64, visemes } = response.data.data;


// //       // console.log('Received data data:', response.data.data);
// //       // console.log('Received data data audioBase64:', response.data.data.audioBase64);
// //       // const { audioBase64, visemes } = response.data.data;

// //       // console.log('Received data data:', response.data.data);
// //       // console.log('Received data data audioBase64:', audioBase64);

// //       // Check if audioBase64 is valid
// //       // if (!audioBase64) {
// //       //   throw new Error('Invalid audio data received');
// //       // }

// //       const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
// //       const audioPlayer = new Audio(audioUrl);

// //       // Add error event listener to audioPlayer
// //       audioPlayer.onerror = (e) => {
// //         console.error('Audio playback error:', e);
// //         set(() => ({
// //           currentMessage: null,
// //           isPlaying: false,
// //           avatarState: 'idle',
// //           loading: false,
// //           error: 'Error playing audio',
// //         }));
// //       };

// //       message.visemes = visemes;
// //       message.audioPlayer = audioPlayer;
// //       message.audioPlayer.onended = () => {
// //         set(() => ({
// //           currentMessage: null,
// //           isPlaying: false,
// //           avatarState: 'idle',
// //         }));
// //       };

// //       // Start playing the audio
// //       message.audioPlayer.play().catch((e) => {
// //         console.error('Error playing audio:', e);
// //         set(() => ({
// //           currentMessage: null,
// //           isPlaying: false,
// //           avatarState: 'idle',
// //           loading: false,
// //         }));
// //       });

// //     } catch (error) {
// //       console.error('Fetch error:', error);
      
// //       let errorMessage = 'An error occurred while fetching TTS data';
// //       if (axios.isAxiosError(error)) {
// //         if (error.response) {
// //           console.error('Error response:', error.response.data);
// //           errorMessage = `Server error: ${error.response.status}`;
// //           if (error.response.headers['content-type'].includes('text/html')) {
// //             errorMessage += ' (Received HTML instead of JSON)';
// //           }
// //         } else if (error.request) {
// //           errorMessage = 'No response received from server';
// //         } else {
// //           errorMessage = error.message;
// //         }
// //       }
  
// //       set(() => ({
// //         currentMessage: null,
// //         isPlaying: false,
// //         avatarState: 'idle',
// //         loading: false,
// //         error: errorMessage,
// //       }));
// //     }

// //   },


//   playMessage: async (message) => {
//       set(() => ({
//         currentMessage: message,
//         avatarState: 'talking',
//       }));
  
//       if (!message.audioPlayer) {
//         set(() => ({
//           loading: true,
//         }));
//         const audioRes = await axiosInstance.post(API_URLS.LectureTTS, {
//           teacher: get().teacher,
//           text: message.answer
//         }, {
//           responseType: 'json',
//         });
//         const data = audioRes.data;
//         const audioBase64 = data.audioBase64;
//         const visemes = data.visemes;
  
//         const audioUrl = `data:audio/mpeg;base64,${audioBase64}`;
//         const audioPlayer = new Audio(audioUrl);
  
//         message.visemes = visemes;
//         message.audioPlayer = audioPlayer;
//         message.audioPlayer.onended = () => {
//           set(() => ({
//             currentMessage: null,
//             isPlaying: false,
//             avatarState: 'idle',
//           }));
//         };
//         set(() => ({
//           loading: false,
//           messages: get().messages.map((m) => {
//             if (m.id === message.id) {
//               return message;
//             }
//             return m;
//           }),
//         }));
//       }
  
//       message.audioPlayer.currentTime = 0;
//       message.audioPlayer.play();
//       set({ isPlaying: true, avatarState: 'talking' });
//     },

//     fetchTTS: async (teacher, text) => {
//       set({ loading: true, error: null });
//       try {
//         const data = await getTTS(teacher, text);
    
//         // Log the received data for debugging
//         console.log('Received data:', data);
    
//         // Check if audioBase64 is valid
//         if (!data.audioBase64) {
//           throw new Error('Invalid audio data received');
//         }
    
//         // Convert base64 to Blob
//         const binaryString = atob(data.audioBase64);
//         const len = binaryString.length;
//         const bytes = new Uint8Array(len);
//         for (let i = 0; i < len; i++) {
//           bytes[i] = binaryString.charCodeAt(i);
//         }
//         const audioBlob = new Blob([bytes], { type: 'audio/mp3' });
//         const audioUrl = URL.createObjectURL(audioBlob);
    
//         // Log the audio URL for debugging
//         console.log('Audio URL:', audioUrl);
    
//         // Ensure the audio player is initialized
//         if (!message.audioPlayer) {
//           throw new Error('Audio player is not initialized');
//         }
    
//         // Set the audio source
//         message.audioPlayer.src = audioUrl;
    
//         // Log the audio player state before playing
//         console.log('Audio player state before playing:', message.audioPlayer);
    
//         // Reset and play the audio
//         message.audioPlayer.currentTime = 0;
//         message.audioPlayer.play().then(() => {
//           console.log('Audio playback started');
//           set({ isPlaying: true, avatarState: 'talking' });
//         }).catch(playError => {
//           console.error('Error playing audio:', playError);
//           set({ loading: false, error: playError.message });
//         });
//       } catch (error) {
//         console.error('Error fetching TTS:', error);
//         set({ loading: false, error: error.message });
//       }
//     },

//   // stopMessage: (message) => {
//   //   if (message.audioPlayer) {
//   //     message.audioPlayer.pause();
//   //   }
//   //   set(() => ({
//   //     currentMessage: null,
//   //     isPlaying: false,
//   //     avatarState: 'idle',
//   //   }));
//   // },
// }));



import { create } from 'zustand';
import axios from 'axios';
import axiosInstance from '../utils/axiosInstance';
import { API_URLS } from '../utils/api_routes';

export const teachers = ["Ava", "Naoki"];

export const useAITeacher = create((set, get) => ({
  messages: [],
  currentMessage: null,
  teacher: teachers[0],
  isPlaying: false,
  avatarState: 'idle', // New state to manage avatar animation
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