import axiosInstance from "../utils/axiosInstance";
import { DISCUSSION_API_URLS } from "../utils/api_routes";
import { DiscussionType } from "../types/discussionForum.types";

export async function fetchDiscussions(moduleName: string): Promise<DiscussionType[]> {
    const response = await axiosInstance.get(`${DISCUSSION_API_URLS.GET_DISCUSSIONS}/${moduleName}`);
    return response.data;
}

export async function fetchDiscussion(discussionId: string): Promise<DiscussionType> {
    const response = await axiosInstance.get(`${DISCUSSION_API_URLS.GET_DISCUSSION}/${discussionId}`);
    return response.data;
}

export async function createDiscussion(moduleName: string, title: string, content: string): Promise<DiscussionType> {
    const response = await axiosInstance.post(DISCUSSION_API_URLS.CREATE_DISCUSSION, {
        moduleName,
        title,
        content
    });
    return response.data;
}

export async function addComment(discussionId: string, content: string): Promise<Comment> {
    const response = await axiosInstance.post(`${DISCUSSION_API_URLS.ADD_COMMENT}/${discussionId}`, {
        content
    });
    return response.data;
}

export async function likeDiscussion(discussionId: string): Promise<void> {
    await axiosInstance.post(`${DISCUSSION_API_URLS.LIKE_DISCUSSION}/${discussionId}`);
}

export async function unlikeDiscussion(discussionId: string): Promise<void> {
    await axiosInstance.delete(`${DISCUSSION_API_URLS.UNLIKE_DISCUSSION}/${discussionId}`);
}

export async function likeComment(discussionId: string, commentId: number): Promise<void> {
    await axiosInstance.post(`${DISCUSSION_API_URLS.LIKE_COMMENT}/${discussionId}/${commentId}`);
}

export async function unlikeComment(discussionId: string, commentId: string): Promise<void> {
    await axiosInstance.delete(`${DISCUSSION_API_URLS.UNLIKE_COMMENT}/${discussionId}/${commentId}`);
}