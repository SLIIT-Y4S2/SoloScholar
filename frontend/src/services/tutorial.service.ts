import axiosInstance from "../utils/axiosInstance";

export const getTutorialByIndex = async (id: string) => {
  const response = await axiosInstance.get(`/tutorial/${id}`);
  return response.data.data;
};

export const submitAnswerByQuestionId = async (
  tutorialId: string,
  questionId: number,
  answer: string | null,
  next: number | null
) => {
  const response = await axiosInstance.post(`/tutorial/${tutorialId}/answer`, {
    questionId,
    answer,
    next,
  });
  return response.data.data;
};

export const submitTutorial = async (
  tutorialId: string,
  questionId: number,
  answer: string | null
) => {
  const response = await axiosInstance.post(
    `/tutorial/${tutorialId}/submission`,
    { questionId, answer }
  );
  return response.data.data;
};

export const requestFeedbackService = async (
  tutorialId: string,
  feedback: { [key: string]: string }[]
) => {
  const response = await axiosInstance.post(
    `/tutorial/${tutorialId}/feedback`,
    {
      feedback,
    }
  );
  return response.data.data;
};
