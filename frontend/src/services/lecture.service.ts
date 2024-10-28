import axiosInstance from "../utils/axiosInstance";

export const getLectureByIndex = async (id: string) => {
  const response = await axiosInstance.get(`/lecture/${id}`);
  return response.data;
};

export const submitAnswerByQuestionId = async (
  lectureId: string,
  questionId: number,
  studentAnswer: string | null 
) => {
  const response = await axiosInstance.post(`/lecture/${lectureId}/answer`, {
    questionId,
    studentAnswer,  
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


export const generateSlides = async (lessonTitle: string, content: string) => {
  try {
    const response = await axiosInstance.post(`/lecture/subtopicslides`, {
      lesson_title: lessonTitle,
      content: content,
    });

    if (response.status === 200 && response.data.markdownSlides) {
      return response.data; // Return the entire response data
    } else {
      throw new Error('Failed to generate slides. No valid slides returned.');
    }
  } catch (error) {
    console.error('Error fetching slides:', error);
    throw error;
  }
};


export const updateSubLectureCompletion = async (
  lectureId: string,
  subLectureId: string,
  isCompleted: boolean
) => {
  try {
    const response = await axiosInstance.patch(`/lecture/${lectureId}/sublecture/${subLectureId}/completion`, {
      is_completed: isCompleted,
    });

    if (response.status === 200) {
      return response.data; // Return the entire response data
    } else {
      throw new Error('Failed to update sub-lecture completion status.');
    }
  } catch (error) {
    console.error('Error updating sub-lecture completion status:', error);
    throw error;
  }
};