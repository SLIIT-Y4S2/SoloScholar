import { Socket } from "socket.io-client";

export interface Comment {
    id: number;
    content: string;
    createdAt: string;
    creator: {
        id: string;
        name: string;
        avatar: string;
    };
    likes: number;
    liked: boolean;
}

export interface Discussion {
    id: string;
    title: string;
    content: string;
    createdAt: string;
    creator: {
        id: string;
        name: string;
        avatar: string;
    };
    comments: Comment[];
    likes: number;
    liked: boolean;
}
export interface DiscussionForumContextType {
    discussions: Discussion[];
    fetchDiscussions: () => Promise<void>;
    createDiscussion: (title: string, content: string) => Promise<void>;
    likeDiscussion: (discussionId: string, liked: boolean) => Promise<void>;
    addComment: (discussionId: string, content: string) => Promise<void>;
    likeComment: (commentId: number, liked: boolean) => Promise<void>;
}

export interface WebSocketContextType {
    socket: Socket | null;
}
