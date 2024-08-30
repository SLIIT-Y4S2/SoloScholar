import axiosInstance from "../utils/axiosInstance";

export const getLectureByIndex = async (id: string) => {
  const response = await axiosInstance.get(`/lecture/${id}`);
  return response.data;
};

export const submitAnswerByQuestionId = async (
  lectureId: string,
  questionId: number,
  answer: string | null,
  next: number | null
) => {
  const response = await axiosInstance.post(`/lecture/${lectureId}/answer`, {
    questionId,
    answer,
    next,
  });
  return response.data.data;
};

export const submitLecture = async (
  lectureId: string,
  questionId: number,
  answer: string | null
) => {
  const response = await axiosInstance.post(
    `/lecture/${lectureId}/submission`,
    { questionId, answer }
  );
  return response.data.data;
};

export const requestFeedbackService = async (
  lectureId: string,
  feedback: { [key: string]: string }[]
) => {
  const response = await axiosInstance.post(
    `/lecture/${lectureId}/feedback`,
    {
      ...feedback,
    }
  );
  return response.data.data;
};

export const completeLectureService = async (lectureId: string) => {
  const response = await axiosInstance.post(`/lecture/${lectureId}/complete`);
  return response.data.data;
};



export const getTTS = async (teacher: string, text: string) => {
  try {
    const response = await axiosInstance.get('/tts', {
      params: {
        teacher,
        text,
      },
    });

    console.log("TTS response:", response.data);
    return response.data.data; // Return the data property directly
  } catch (error) {
    console.error('Error fetching TTS:', error);
    throw error;
  }
};