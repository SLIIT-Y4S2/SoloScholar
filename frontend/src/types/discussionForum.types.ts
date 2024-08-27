export interface Topic {
    id: number;
    title: string;
    content: string;
    userId: number;
}

export interface Comment {
    id: number;
    content: string;
    userId: number;
    topicId: number;
}
