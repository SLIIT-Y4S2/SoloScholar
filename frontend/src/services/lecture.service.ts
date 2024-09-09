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


export const generateMarkdownSlides = async (lessonTitle: string, content: string): Promise<string[]> => {
  try {
    const response = await axiosInstance.post(`/lecture/subtopicslides`, {
      lesson_title: lessonTitle,
      content: content,
    });

    if (response.status === 200 && response.data.markdownSlides) {
      // Assuming markdownSlides is returned as a single string separated by some delimiter, e.g., "\n\n" for paragraphs
      const markdownSlides: string[] = response.data.markdownSlides.split('\n\n'); // Adjust delimiter as necessary
      return markdownSlides;
    } else {
      throw new Error('Failed to generate markdown slides. No valid slides returned.');
    }
  } catch (error) {
    console.error('Error fetching markdown slides:', error);
    throw error;
  }
};