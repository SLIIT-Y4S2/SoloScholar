import { Socket } from "socket.io-client";

export interface LikeType {
    id: string;
    discussion_id?: string;
    comment_id?: number;
    person_id: string;
    created_at: string;
}

export interface CommentType {
    id: number;
    content: string;
    created_at: string;
    updated_at: string;
    discussion_id: string;
    creator_id: string;
    likes: LikeType[];
    _count: {
        likes: number;
    };
    likeCount: number;
    isLiked: boolean;
    creatorName: string;
}

export interface DiscussionType {
    id: string;
    title: string;
    content: string;
    created_at: string;
    updated_at: string;
    module_id: number;
    creator_id: string;
    comments: CommentType[];
    likes: LikeType[];
    _count: {
        likes: number;
        comments: number;
    };
    likeCount: number;
    isLiked: boolean;
    creatorName: string;
}

export interface DiscussionForumContextType {
    discussions: DiscussionType[];
    fetchDiscussions: () => Promise<void>;
    createDiscussion: (title: string, content: string) => Promise<void>;
    likeDiscussion: (discussionId: string, liked: boolean) => Promise<void>;
    addComment: (discussionId: string, content: string) => Promise<void>;
    likeComment: (commentId: number, liked: boolean) => Promise<void>;
}

export interface WebSocketContextType {
    socket: Socket | null;
}
